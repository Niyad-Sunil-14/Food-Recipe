from django.shortcuts import render
from rest_framework import viewsets,permissions,status,filters
from .models import Recipe,MealPlan,Review,Instruction,Ingredient
from .serializer import UserSerializer,RecipeSerializer, MealPlanSerializer,ReviewSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import json
from django.db.models import Avg
from rest_framework import serializers
# Create your views here.

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request (GET, HEAD, OPTIONS).
        # This allows anyone to view recipes.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the author of the recipe.
        # This checks if the user making the request is the same as the
        # user who created the recipe object.
        if hasattr(obj, 'author'):
            return obj.author == request.user
            
        # This is a fallback for other models like Review or MealPlan
        # that use a 'user' field instead of an 'author' field.
        return obj.user == request.user

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self,request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView):
    """
    Custom view for user login.
    Accepts username and password, returns JWT access and refresh tokens.
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Please provide both username and password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Authenticate the user
        user = authenticate(username=username, password=password)

        if user is not None:
            # If authentication is successful, generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # You can also include user data in the response if you want
            user_data = UserSerializer(user).data

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_data 
            }, status=status.HTTP_200_OK)
        
        # If authentication fails
        return Response(
            {"error": "Invalid Credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )


class RecipeView(viewsets.ModelViewSet):
    queryset = Recipe.objects.all().order_by('-created_at')
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly]

    # --- THIS IS THE NEW PART ---
    # 2. Add the SearchFilter
    filter_backends = [filters.SearchFilter]
    # 3. Specify which fields the search should look at
    search_fields = ['title', 'description']
    # --- END OF NEW PART ---

    def get_queryset(self):
        """
        This method now explicitly filters by author if an ID is provided.
        """
        # Start with the base queryset
        queryset = Recipe.objects.all().prefetch_related('ingredients', 'instructions','review')

        # --- THIS IS THE FIX ---
        # Check if an 'author' ID is provided in the URL query parameters
        author_id = self.request.query_params.get('author', None)
        if author_id is not None:
            # If it is, filter the queryset to only include recipes from that author
            queryset = queryset.filter(author__id=author_id)
        # --- END OF FIX ---

        # Now, apply ordering to the (potentially filtered) queryset
        ordering_param = self.request.query_params.get('ordering', None)
        if ordering_param == 'latest':
            return queryset.order_by('-created_at')

        # Default ordering for the home page (which won't have an author_id)
        return queryset.annotate(
            average_rating=Avg('review__rating')
        ).order_by('-average_rating')
    

    def update(self, request, *args, **kwargs):
        """
        Custom update logic to handle nested ingredients and instructions.
        """
        instance = self.get_object()
        
        # This is the line to change.
        # Change partial=False to partial=True
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # --- The rest of your update logic remains the same ---
        instance.ingredients.all().delete()
        instance.instructions.all().delete()

        ingredients_data = json.loads(request.data.get('ingredients', '[]'))
        for ingredient_data in ingredients_data:
            if ingredient_data.get('name'):
                Ingredient.objects.create(recipe=instance, **ingredient_data)

        instructions_data = json.loads(request.data.get('instructions', '[]'))
        for index, instruction_data in enumerate(instructions_data):
            if instruction_data.get('description'):
                Instruction.objects.create(
                    recipe=instance,
                    step_number=index + 1,
                    description=instruction_data['description']
                )

        return Response(serializer.data)


    def create(self, request, *args, **kwargs):
        # --- Start of Debugging ---
        print("--- NEW RECIPE REQUEST RECEIVED ---")
        print("Request Data:", request.data)
        # --- End of Debugging ---

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        recipe = serializer.instance

        # Handle Ingredients
        try:
            ingredients_data_str = request.data.get('ingredients', '[]')
            print("Received ingredients string:", ingredients_data_str) # DEBUG
            ingredients_data = json.loads(ingredients_data_str)
            print("Parsed ingredients data:", ingredients_data) # DEBUG

            for ingredient_data in ingredients_data:
                if ingredient_data.get('name'):
                    Ingredient.objects.create(recipe=recipe, **ingredient_data)
                    print(f"SUCCESS: Saved ingredient '{ingredient_data.get('name')}'") # DEBUG
                else:
                    print("SKIPPED: Ingredient without a name.") # DEBUG

        except json.JSONDecodeError:
            print("ERROR: Failed to parse ingredients JSON.") # DEBUG
        except Exception as e:
            print(f"An error occurred while saving ingredients: {e}") # DEBUG

        # Handle Instructions
        try:
            instructions_data_str = request.data.get('instructions', '[]')
            print("Received instructions string:", instructions_data_str) # DEBUG
            instructions_data = json.loads(instructions_data_str)
            print("Parsed instructions data:", instructions_data) # DEBUG

            for index, instruction_data in enumerate(instructions_data):
                if instruction_data.get('description'):
                    Instruction.objects.create(
                        recipe=recipe, 
                        step_number=index + 1,
                        description=instruction_data['description']
                    )
                    print(f"SUCCESS: Saved instruction step {index + 1}") # DEBUG
                else:
                    print("SKIPPED: Instruction without a description.") # DEBUG
        
        except json.JSONDecodeError:
            print("ERROR: Failed to parse instructions JSON.") # DEBUG
        except Exception as e:
            print(f"An error occurred while saving instructions: {e}") # DEBUG

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class MealPlanView(viewsets.ModelViewSet):
    serializer_class = MealPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MealPlan.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
    # Automatically associate the meal plan with the logged-in user.
        serializer.save(user=self.request.user)


class ReviewView(viewsets.ModelViewSet):
    queryset =  Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # 2. Get the recipe being reviewed from the submitted data
        recipe = serializer.validated_data['recipe']

        # 3. Check if the person submitting the review is the recipe's author
        if recipe.author == self.request.user:
            # If they are the same, raise an error
            raise serializers.ValidationError("You cannot review your own recipe.")
        
        # If they are different, save the review as normal
        serializer.save(user=self.request.user)
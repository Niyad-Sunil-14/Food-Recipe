from rest_framework import serializers
from .models import Recipe,MealPlan,Review,Instruction,Ingredient
from django.contrib.auth.models import User
from django.http import JsonResponse,HttpResponse
from rest_framework.validators import UniqueValidator
from django.db.models import Avg


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,required=True,min_length=8)
    email = serializers.EmailField(required = True,validators=[UniqueValidator(queryset=User.objects.all(),message="User with this email already exists.")])
    
    class Meta:
        model = User
        fields = ['id','username','password','email','date_joined']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
        )
        return user


class MealPlanSerializer(serializers.ModelSerializer):
    recipe_title = serializers.CharField(source='recipe.title', read_only=True)

    # This field is used for WRITE operations (POST requests).
    # It accepts the recipe's ID.
    recipe = serializers.PrimaryKeyRelatedField(
        queryset=Recipe.objects.all(), write_only=True
    )
    class Meta:
        model = MealPlan
        fields = ['id', 'user', 'recipe','recipe_title', 'day_of_week', 'meal_type']
        read_only_fields = ['user']


class IngredientSerializer(serializers.ModelSerializer):
    """Serializer for the Ingredient model."""
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'quantity', 'unit']


class InstructionSerializer(serializers.ModelSerializer):
    """Serializer for the Instruction model."""
    class Meta:
        model = Instruction
        fields = ['id', 'step_number', 'description']


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for the Review model."""
    user = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Review
        fields = ['id', 'user', 'recipe', 'rating', 'comment', 'created_at']

        
class RecipeSerializer(serializers.ModelSerializer):
    """A detailed serializer for the Recipe model with nested data."""
    author = UserSerializer(read_only=True)
    ingredients = IngredientSerializer(many=True, read_only=True)
    instructions = InstructionSerializer(many=True, read_only=True)
    review = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = [
            'id', 'title', 'description', 'author', 'prep_time_minutes', 
            'cook_time_minutes', 'image', 'created_at', 'updated_at',
            'ingredients', 'instructions', 'review','average_rating'
        ]
        read_only_fields = ['author']

    def get_average_rating(self, obj):
        # 'obj' is the Recipe instance.
        # This calculates the average rating from the related reviews.
        return obj.review.aggregate(Avg('rating')).get('rating__avg')
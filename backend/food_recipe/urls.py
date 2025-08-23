from django.urls import path,include
from .views import RecipeView,MealPlanView,ReviewView
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'recipe', RecipeView, basename='recipe')
router.register(r'mealplan',MealPlanView, basename='mealplan')
router.register(r'review',ReviewView, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]

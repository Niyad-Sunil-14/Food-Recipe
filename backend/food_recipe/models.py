from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import Avg
# Create your models here.

class Recipe(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=1000)
    author = models.ForeignKey(User,on_delete=models.CASCADE,related_name='author',null=True)
    image = models.ImageField(upload_to='food_images/')
    created_at = models.DateTimeField(auto_now_add=True)
    prep_time_minutes = models.PositiveIntegerField(null=True)
    cook_time_minutes = models.PositiveIntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True)
    updated_at = models.DateTimeField(auto_now=True,null=True)

    def __str__(self):
        return self.title
    

class Ingredient(models.Model):
    recipe = models.ForeignKey(Recipe,on_delete=models.CASCADE,related_name='ingredients')
    name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    unit = models.CharField(max_length=100,help_text="e.g., grams, cups, tsp")

    def __str__(self):
        return f"{self.quantity} {self.unit} of {self.name}"
    

class Instruction(models.Model):
    recipe = models.ForeignKey(Recipe,on_delete=models.CASCADE,related_name='instructions')
    step_number = models.PositiveIntegerField()
    description = models.TextField(max_length=1000)

    class Meta:
        # Ensures instructions are always ordered by their step number for a given recipe.
        ordering = ['step_number']
        # Prevents creating two instructions with the same step number for the same recipe.
        unique_together = ['recipe', 'step_number']

    def __str__(self):
        return f"Step {self.step_number} for {self.recipe.title}"
    

class Review(models.Model):
    recipe = models.ForeignKey(Recipe,on_delete=models.CASCADE,related_name='review')
    user = models.ForeignKey(User,models.CASCADE,related_name='review')
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1),MaxValueValidator(5)])
    comment = models.TextField(max_length=1000,blank=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True)

    class Meta:
        # A user can only write one review per recipe.
        unique_together = ['recipe', 'user']

    def __str__(self):
        return f"Review by {self.user.username} for {self.recipe.title}" 
    

class MealPlan(models.Model):
    DAY_CHOICES = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ]

    MEAL_CHOICES = [
        ('Breakfast', 'Breakfast'),
        ('Lunch', 'Lunch'),
        ('Dinner', 'Dinner'),
        ('Snack', 'Snack'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal_plans')
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    day_of_week = models.CharField(max_length=10, choices=DAY_CHOICES)
    meal_type = models.CharField(max_length=10, choices=MEAL_CHOICES)

    def __str__(self):
        return f"{self.user.username}'s {self.meal_type} for {self.day_of_week}"
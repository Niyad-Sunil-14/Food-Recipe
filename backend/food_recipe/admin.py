from django.contrib import admin
from .models import Ingredient,Instruction,MealPlan,Recipe,Review

# Register your models here.

admin.site.register(Recipe)
admin.site.register(Ingredient)
admin.site.register(Instruction)
admin.site.register(Review)
admin.site.register(MealPlan)

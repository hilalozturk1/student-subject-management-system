from django.db import models

class Student(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    email = models.EmailField(unique=True)
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
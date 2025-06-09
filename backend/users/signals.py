from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from students.models import Student

User = get_user_model()

@receiver(post_save, sender=User)
def create_student_for_new_user(sender, instance, created, **kwargs):
    if created and not instance.is_staff:
        Student.objects.get_or_create(
            user=instance,
            defaults={
                "first_name": instance.username,
                "last_name": "",
                "email": instance.email,
                "date_of_birth": "2000-01-01",
            }
        )
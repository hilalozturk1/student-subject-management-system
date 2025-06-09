from django.core.management.base import BaseCommand
from students.models import Student
from courses.models import Course
from enrollments.models import Enrollment

class Command(BaseCommand):
    help = 'Create example enrollments'

    def handle(self, *args, **kwargs):
        students = Student.objects.all()
        courses = Course.objects.all()
        for student in students:
            for course in courses[:2]:
                Enrollment.objects.get_or_create(student=student, course=course)
        self.stdout.write(self.style.SUCCESS('Example enrollments created.'))
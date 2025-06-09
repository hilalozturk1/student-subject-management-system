from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from students.models import Student
from enrollments.models import Enrollment
from courses.models import Course
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class EnrollmentAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="admin",
            password="admin",
            is_staff=True,
            is_superuser=True
        )
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        self.student = Student.objects.create(
            first_name="Ali",
            last_name="Veli",
            date_of_birth="2000-01-01",
            email="ali@example.com"
        )
        self.course = Course.objects.create(name="Mathematics")

    def test_list_enrollments(self):
        url = reverse('enrollment-list')
        response = self.client.get(url)
        print("*******ENROLLMENT LIST TEST RESULT*******", response.status_code)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_enrollment(self):
        url = reverse('enrollment-list')
        data = {"student": self.student.id, "course": self.course.id}
        response = self.client.post(url, data)
        print("******ENROLLMENT CREATE TEST RESULT*******",response.status_code)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
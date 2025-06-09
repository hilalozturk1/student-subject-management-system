from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from students.models import Student

User = get_user_model()

class StudentAPITests(APITestCase):
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

    def test_list_students(self):
        url = reverse('student-list')
        response = self.client.get(url)
        print("*******STUDENT LIST TEST RESULT*******", response.status_code)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_student(self):
        url = reverse('student-list')
        data = {
            "first_name": "Ayşe",
            "last_name": "Yılmaz",
            "date_of_birth": "2001-02-03",
            "email": "ayse@example.com"
        }
        response = self.client.post(url, data)
        print("********STUDENT CREATE TEST RESULT*******",response.status_code)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
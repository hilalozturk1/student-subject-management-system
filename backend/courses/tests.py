from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from courses.models import Course

User = get_user_model()

class CourseAPITests(APITestCase):
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
        self.course = Course.objects.create(name="Literature")

    def test_list_courses(self):
        url = reverse('course-list')
        response = self.client.get(url)
        print("******COURSES LIST TEST RESULT *******", response.status_code)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_course(self):
        url = reverse('course-list')
        data = {"name": "History"}
        response = self.client.post(url, data)
        print("********COURSES CREATE TEST RESULT*******",response.status_code)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
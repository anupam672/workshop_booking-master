from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, ActivateAccountView, LoginView, LogoutView, RefreshTokenView,
    ProfileView, ProfileUpdateView, UserProfileDetailView,
    WorkshopTypeViewSet, WorkshopViewSet,
    StatisticsPublicView, StatisticsTeamView
)

router = DefaultRouter()
router.register(r'workshop-types', WorkshopTypeViewSet, basename='workshop-type')
router.register(r'workshops', WorkshopViewSet, basename='workshop')

urlpatterns = [
    # Auth endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/activate/<str:activation_key>/', ActivateAccountView.as_view(), name='activate'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),

    # Profile endpoints
    path('profile/me/', ProfileView.as_view(), name='profile'),
    path('profile/me/update/', ProfileUpdateView.as_view(), name='profile_update'),
    path('profile/<int:user_id>/', UserProfileDetailView.as_view(), name='user_profile'),

    # Statistics endpoints
    path('statistics/public/', StatisticsPublicView.as_view(), name='statistics_public'),
    path('statistics/team/', StatisticsTeamView.as_view(), name='statistics_team'),

    # Router URLs (workshop-types and workshops)
    path('', include(router.urls)),
]

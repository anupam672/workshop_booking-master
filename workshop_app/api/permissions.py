from rest_framework.permissions import BasePermission


class IsEmailVerified(BasePermission):
    """Check if user's email is verified."""
    message = "Email verification required."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if hasattr(request.user, 'profile'):
            return request.user.profile.is_email_verified
        return False


class IsInstructor(BasePermission):
    """Check if user belongs to instructor group."""
    message = "Instructor role required."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.groups.filter(name='instructor').exists()


class IsCoordinator(BasePermission):
    """Check if user is a coordinator (authenticated but not instructor)."""
    message = "Coordinator role required."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # Coordinator is someone who is authenticated but NOT in instructor group
        return not request.user.groups.filter(name='instructor').exists()

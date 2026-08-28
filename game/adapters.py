import logging

from allauth.socialaccount.adapter import DefaultSocialAccountAdapter


logger = logging.getLogger(__name__)


class TradeLeagueSocialAccountAdapter(DefaultSocialAccountAdapter):
    """Keep OAuth failures diagnosable without logging credentials or tokens."""

    def on_authentication_error(
        self, request, provider, error=None, exception=None, extra_context=None
    ):
        logger.warning(
            "Social login failed: provider=%s error=%s exception_type=%s",
            provider.id,
            error,
            type(exception).__name__ if exception else None,
        )
        return super().on_authentication_error(
            request,
            provider,
            error=error,
            exception=exception,
            extra_context=extra_context,
        )

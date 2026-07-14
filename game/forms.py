from django import forms
from django.contrib.auth.models import User

class RegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ["username","password"]


class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)


class InvestmentForm(forms.Form):
    amount = forms.FloatField(min_value=1)


class RoomCodeForm(forms.Form):
    room_code = forms.CharField(
        max_length=8,
        widget=forms.TextInput(attrs={
            "placeholder": "Enter room code",
            "class": "w-full px-4 py-3 rounded-none uppercase",
            "autocomplete": "off",
        })
    )

    def clean_room_code(self):
        return self.cleaned_data["room_code"].strip().upper()

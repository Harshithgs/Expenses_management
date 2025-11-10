from django.conf import settings
from django.urls import path
from django.conf.urls.static import static

from . views import *
urlpatterns = [
    path('signup/',signup,name="signup"),
    path('login/',login,name="login"),
    path('expense/',add_or_update_expense,name="expense"),
    path('getexpense/<int:user_Id>/',getexpense,name="getexpense"),
    path('forgetpassword/',forget_password,name="forget_password"),
    path('reset/',reset_verify_opt,name="reset_verify_opt"),
    path('editexpense/',add_or_update_expense,name="expense"),
    path('editprofile/', edit_profile, name="edit_profile"),
    path('viewprofile/<int:user_id>/',view_profile,name="view_profile"),
    path('bulkexpense/',bulk_upload_expenses,name="bulk_upload_expenses_json"),
    path('summary/<int:user_id>/',expense_summary,name="expense_summary"),
    path('download-expense-report/<int:user_id>/<str:category>/', download_expense_report, name='download_expense_report_by_category'),
    path('download-expense-report/<int:user_id>/', download_expense_report, name='download_expense_report_by_category'),
    path('deleteuser/<int:user_id>/', delete_user, name="delete_user"),
    path('api/deleteexpense/<int:id>/',delete_expense, name='delete_expense'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
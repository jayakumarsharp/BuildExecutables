var LoginApp = angular.module('LoginApp', []);

LoginApp.controller('LoginController', ['$location', '$scope', function ($location, $scope) {
    $scope.errorMessage = '';
    jQuery(function ($) {
        //Generic Ajax handler
        $('form[data-async]').on('submit', function (event) {
            var $form = $(this);
            var $target = $($form.attr('data-target'));
            var $id = "#" + $form.attr('id');
            var disabled = $form.find(':input:disabled').removeAttr('disabled');
            $('.validation').html("<img width='50' height='50' src='../../Content/images/ajax-loader2.gif' />");
            $.ajax({
                type: $form.attr('method'),
                url: $form.attr('action'),
                data: $form.serialize(),
                success: function (data, status) {
                    $('.validation').html(data);
                    if (data === "Logged in successfully") {
                        reloadPage("#RedirectToHome");
                    }
                    else {
                        $scope.$apply(function () {
                            $scope.errorMessage = data;
                        });
                        //$toaster.pop('error', "Error", data, null);
                    }
                }
            });
            disabled.attr('disabled', 'disabled');
            event.preventDefault();
        });

        //Redirect helper
        function reloadPage(redirectTo) {
            var url = $(redirectTo).val();
            location.href = url;
        }
    });


}]);

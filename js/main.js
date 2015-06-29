$(document).ready(function () {

    i18n.init({}, function (err, t) {
        $('body').fadeIn();
        $('[data-i18n]').i18n();
        $('body').fadeIn();
    });

    $form = $('form');
    if ($form.length && $form.bootstrapValidator) {
        var _fields = {}
        _fields[('register-name')] = {
            validators: {
                notEmpty: {
                    message: 'Please Enter Your Name'
                }
            }
        };
        _fields[('register-contact')] = {
            validators: {
                notEmpty: {
                    message: 'Please Enter Your Contact No'
                }
            }
        };
        _fields[('register-email')] = {
            validators: {
                notEmpty: {
                    message: 'Please Enter Your Email'
                }
            }
        };
        _fields['register-agree'] = {
            validators: {
                notEmpty: {
                    message: 'Agreement is required for Submit'
                }
            }
        }

        $form.bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: _fields
        }).on('success.form.bv', function (e) {
            console.log('success.form.bv');
            e.preventDefault();
            var $form = $(e.target);
            var section_index = parseInt($form.attr('id').split('-')[1]);

            var $bv = $form.data('bootstrapValidator');
            $data = {}
            $data['name'] = $form.find('#register-name').val();
            $data['contact'] = $form.find('#register-contact').val();
            $data['email'] = $form.find('#register-email').val();

            if (1) {
                waitingDialog.show('Loading...');
                $.post($form.attr('action'), $data, null, 'json').done(function (result) {
                    // ... Process the result ...
                    if (result.error_exist) {
                        $form.data('bootstrapValidator').disableSubmitButtons(false);

                        if (result.recover_suggestion) {
                            bootbox.alert('Fail to submit : ' + result.error_message + '<br/>' + result.recover_suggestion).verticalcenter();
                        } else {
                            bootbox.alert('Fail to submit : ' + result.error_message).verticalcenter();
                        }
                    } else {
                        //                        var bb = bootbox.confirm('Successfully sumbitted.', function () {});
                        //                        $form.data('bootstrapValidator').resetForm();
                        //                        $form[0].reset();
                        //                        setTimeout(function () {
                        //                            //bootbox.hideAll();
                        //                        }, 5000);
                        window.open('thankyou.html', '_self');
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    $form.data('bootstrapValidator').disableSubmitButtons(false);
                    bootbox.alert('Fail to submit : ' + errorThrown + '<br/>' + 'Please try again later').verticalcenter();
                }).always(function () {
                    waitingDialog.hide();
                });

            } else {
                var bb = bootbox.alert('Successfully sumbitted.');
                $form.data('bootstrapValidator').resetForm();
                $form[0].reset();
                setTimeout(function () {
                    bootbox.hideAll();
                }, 5000);
            }
        });
        $form.on('reset', function () {
            $form.data('bootstrapValidator').resetForm();
        });
    }
});
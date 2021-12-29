/*
Name: 			custom.js
Written by: 	http://xfinitysoft.com/
Theme Version:	1.0
Created at:     09/03/2019
*/

$(document).ready(function() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // Initialize bootstrap tooltip.
    $('[data-toggle="tooltip"]').tooltip();
    $('body').tooltip({selector: '[data-toggle="tooltip"]'});

    // Initialize select2 for dropdown
    $('.select2').select2();

    // Initialize iCheck for checkbox
    $('input.icheck-g').iCheck({checkboxClass: 'icheckbox_minimal-green'});
    $('input.icheck-b').iCheck({checkboxClass: 'icheckbox_minimal-blue'});
    $('input.icheck-f-g').iCheck({checkboxClass: 'icheckbox_flat-green'});
    $('input.icheck-f-r').iCheck({checkboxClass: 'icheckbox_flat-red'});
    $('input.icheck-f-b').iCheck({checkboxClass: 'icheckbox_flat-blue'});





    /*
     * Script for users/create.blade.php and edit.blade.php page.
    */

    // click on change password to display the new and confirm password field
    $('.iCheck-helper, .chngPassL').click(function() {
        if ($('#change_password').prop("checked") == true) {
            $('div.change-password').removeClass('d-none');
            $('#user_password').prop('disabled', false);
            $('#user_password').css('cursor', 'text');
            $('#user_confirm_password').prop('disabled', false);
            $('#user_confirm_password').css('cursor', 'text');
        } else {
            $('div.change-password').addClass('d-none');
            $('#user_password').prop('disabled', true);
            $('#user_password').css('cursor', 'not-allowed');
            $('#user_confirm_password').prop('disabled', true);
            $('#user_confirm_password').css('cursor', 'not-allowed');
        }
    });

    // choose picture and preview in the img tag and set the name in the picture label before updating.
    $('#profile_picture').on('change', function() {
        var input = this;
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                $('#preview_image').prop('src', e.target.result);
                $('#picLabel').text(input.files[0].name);
            }
            reader.readAsDataURL(input.files[0]);
        }
    });


    /*
     * Script for users/list.blade.php page.
    */

    // Initialize datatable for listing the users.
    $('#user-dataTable').DataTable({
        processing: true,
        serverSide: true,
        "responsive": true,
        ajax: base_url+'/userslist',

        columns: [
            { data: 'id', name: 'id' },
            { data: 'name', name: 'name', orderable: false },
            { data: 'email', name: 'email', orderable: false },
            { data: 'gender', name: 'gender', orderable: false },
            { data: 'roles', orderable: false, render:function(data, type, row){ if(data.length == 0){ return 'N/A'; }else{ var role = ''; for(var i=0; i<data.length; i++){ if (i != data.length - 1) {role += data[i]['name']+", ";} else{role += data[i]['name'];} } return role; } } },
            { data: 'status', orderable: false, render:function(data, type, row){ if(data == null) { return 'Pending'; } else if (data == 'active') { return '<span class="text-success">'+data.charAt(0).toUpperCase() + data.slice(1)+'</span>'; } else { return '<span class="text-danger">'+data.charAt(0).toUpperCase() + data.slice(1)+'</span>'; } } },
            { data: 'id',searchable: false, orderable: false, render:function(data, type, row){ if(permissions.user_management) { if(row.status == 'active'){ return '<span  class="btn-group" role="group" aria-label="..."> <a href="#" class="btn btn-link btnUserActive deactive" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Deactivate"> <span class="fa fa-toggle-on"></span></a>  <a href="'+base_url+'/user/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a> <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger user-del" ><span class="ti-trash"></span></button> </span>'; } else { return '<span  class="btn-group" role="group" aria-label="..."> <a href="#" class="btn btn-link btnUserActive" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Activate"> <span class="fa fa-toggle-off"></span></a>  <a href="'+base_url+'/user/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a> <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger user-del" ><span class="ti-trash"></span></button> </span>'; } } else {return 'No Permission'} } }

        ],
        initComplete: function () {

        }
    });

    // user activate and deactivate on toggle button click
    $(document).on('click', '.btnUserActive', function(e) {
        e.preventDefault();
        var id = $(this).attr('data-value');
        if ($(this).hasClass('deactive')) {
            var dataC = 'You want to <strong> deactive </strong> this user?';
        } else {
            var dataC = 'You want to <strong> active </strong> this user?';
        }
        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-warning',
            title: 'Are you sure?',
            content: dataC,
            type: 'orange',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-orange',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/user/'+id+'/status',
                            success: function(data) {
                                if (data.success == false) {
                                    $('#user-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#user-alert-danger').removeClass('d-none');
                                    $("#user-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#user-alert-danger').addClass('d-none');
                                        $("#user-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#user-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#user-alert-success').removeClass('d-none');
                                    $("#user-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#user-alert-success').addClass('d-none');
                                        $("#user-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/user');
                                    }, 2000);
                                }
                            },
                            error: function(edata) {
                                if (edata.success == false) {
                                    $('#user-alert-danger').removeClass('d-none');
                                    $('#user-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });

    // click on delete button to delete selected user.
    $(document).on('click', '.user-del', function(e) {
        var id = $(this).attr('data-value');
        var curr = $(this);

        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-times-circle-o red',
            title: 'Are you sure?',
            content: 'You want to delete this user?',
            type: 'red',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-red',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/user/'+id,
                            data: {_method:'DELETE'},
                            success: function(data) {
                                if (data.success == false) {
                                    $('#user-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#user-alert-danger').removeClass('d-none');
                                    $("#user-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#user-alert-danger').addClass('d-none');
                                        $("#user-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#user-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#user-alert-success').removeClass('d-none');
                                    $("#user-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#user-alert-success').addClass('d-none');
                                        $("#user-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/user');
                                    }, 2000);

                                }
                            },
                            error: function(edata) {
                                if (edata.success == false) {
                                    $('#user-alert-danger').removeClass('d-none');
                                    $('#user-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });






    /*
     * Script for roles/list.blade.php page.
    */

    // Initialize datatable for listing the roles and permissions.
    $('#user-roles-dataTable').DataTable({
        processing: true,
        serverSide: true,
        "responsive": true,
        ajax: base_url+'/roleslist',

        columns: [
            { data: 'name', name: 'name', orderable: false },
            { data: 'permissions', orderable: false, render:function(data, type, row){ if(data.length == 0){ return ''; }else{ var perm = ''; for(var i=0; i<data.length; i++){ if (i != data.length - 1) {perm += data[i]['name']+", ";} else{perm += data[i]['name'];} } return perm; } } },

            { data: 'id',searchable: false, orderable: false, render:function(data, type, row){ if(permissions.roles_management) { return '<span  class="btn-group" role="group" aria-label="..."> <a href="'+base_url+'/role/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a>  <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger role-del" ><span class="ti-trash"></span></button> </span>'; } else { return 'No Permission' } } }
        ],
        initComplete: function () {

        }
    });

    // click on delete button to delete selected role.
    $(document).on('click', '.role-del', function(e) {
        var id = $(this).attr('data-value');
        var curr = $(this);

        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-times-circle-o red',
            title: 'Are you sure?',
            content: 'You want to delete this role?',
            type: 'red',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-red',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/role/'+id,
                            data: {_method:'DELETE'},
                            success: function(data){
                                if (data.success == false) {
                                    $('#user-roles-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#user-roles-alert-danger').removeClass('d-none');
                                    $("#user-roles-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#user-roles-alert-danger').addClass('d-none');
                                        $("#user-roles-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#user-roles-alert-success').html(data.message);
                                    $('#user-roles-alert-success').removeClass('d-none');
                                    $("#user-roles-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#user-roles-alert-success').addClass('d-none');
                                        $("#user-roles-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/role');
                                    }, 2000);
                                }
                            },
                            error: function(edata) {
                                if (edata.success == false) {
                                    $('#user-roles-alert-danger').removeClass('d-none');
                                    $('#user-roles-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });






    /*
     * Script for cities/list.blade.php page.
    */

    // Initialize datatable for listing the cities.
    $('#city-dataTable').DataTable({
        processing: true,
        serverSide: true,
        "responsive": true,
        ajax: base_url+'/citieslist',

        columns: [
            { data: 'id', name: 'id' },
            { data: 'name', name: 'name', orderable: false },
            { data: 'local_name', orderable: false, render:function(data, type, row){ if(data == null) { return 'N/A'; } else { return data; } } },
            { data: 'status', orderable: false, render:function(data, type, row){ if(data == 1) { return '<span class="text-success">Active</span>'; } else { return '<span class="text-danger">Not Active</span>'; } } },

            { data: 'id',searchable: false, orderable: false, render:function(data, type, row){ if(permissions.city_management) { return '<span  class="btn-group" role="group" aria-label="...">  <a href="'+base_url+'/city/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a>  <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger city-del" ><span class="ti-trash"></span></button> </span>'; } else { return 'No Permission'; } } }
        ],
        initComplete: function () {

        }
    });

    // click on delete button to delete selected city.
    $(document).on('click', '.city-del', function(e) {
        var id = $(this).attr('data-value');
        var curr = $(this);

        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-times-circle-o red',
            title: 'Are you sure?',
            content: 'You want to delete this city?',
            type: 'red',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-red',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/city/'+id,
                            data: {_method:'DELETE'},
                            success: function(data) {
                                if (data.success == false) {
                                    $('#city-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#city-alert-danger').removeClass('d-none');
                                    $("#city-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#city-alert-danger').addClass('d-none');
                                        $("#city-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#city-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#city-alert-success').removeClass('d-none');
                                    $("#city-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#city-alert-success').addClass('d-none');
                                        $("#city-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/city');
                                    }, 2000);
                                }
                            },
                            error: function(edata) {
                                if (edata.success == false) {
                                    $('#city-alert-danger').removeClass('d-none');
                                    $('#city-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });







    /*
     * Script for menus/create.blade.php and edit.blade.php page.
    */

    // Events for all checkboxes to perform different actions.
    $('.iCheck-helper').click(function() {
        var curr = $(this);
        if ($(this).closest('div').hasClass('icheckbox_flat-green')) {
            $.fn.externalChecked(curr);
        } else if ($(this).closest('div').hasClass('icheckbox_flat-red')) {
            $.fn.pagesChecked(curr);
        } else if ($(this).closest('div').hasClass('icheckbox_flat-blue')) {
            $.fn.categoryChecked(curr);
        }
    });

    // Event to click on menu external checkbox label.
    $('.menu_externall').click(function() {
        var curr = $(this);
        $.fn.externalChecked(curr);
    });

    // Event to click on page checkboxes label to checked the icheck for that label.
    $('.pagel').click(function() {
        var curr = $(this);
        $.fn.pagesChecked(curr);
    });

    // Event to click on category checkboxes label to checked the icheck for that label.
    $('.categoryl').click(function() {
        var curr = $(this);
        $.fn.categoryChecked(curr);
    });

    // function to enable or disable readonly attribute for menu slug.
    $.fn.externalChecked = function(curr) {
        if (curr.closest('div.icheckbox_flat-green').find('input.menu_external').prop("checked") == true ||
        curr.prev('div.icheckbox_flat-green').find('input.menu_external').prop("checked") == true) {
            $('#menu_slug').prop("readonly", false);
        } else if (curr.closest('div.icheckbox_flat-green').find('input.menu_external').prop("checked") == false ||
        curr.prev('div.icheckbox_flat-green').find('input.menu_external').prop("checked") == false) {
            $('#menu_slug').prop("readonly", true);
        }
    }

    // function to automatically fill the menu slug when any checkbox checked for pages.
    $.fn.pagesChecked = function(curr) {
        var slug = curr.closest('div.pagediv').find('input.page').val();
        var string = curr.closest('div.pagediv').find('label.pagel').text();
        // var text = string.replace(/\s+/g, "-");
        // console.log(text.toLowerCase());

        if (curr.closest('div.pagediv').find('input.page').prop('checked') == true) {
            $('#menu_slug').prop("value", "page/"+slug);
        }

        if ($('.page:checked').length > 1) {
            $('div.icheckbox_flat-red').removeClass("checked");
            $('.page').prop("checked", false);
            curr.closest('div.pagediv').find('div.icheckbox_flat-red').addClass("checked");
            curr.closest('div.pagediv').find('input.page').prop("checked", true);
        } else if ($('.page:checked').length == 0) {
            $('#menu_slug').prop("value", '');
        }
    }

    // function to automatically fill the menu slug when any checkbox checked for categories.
    $.fn.categoryChecked = function(curr) {
        var slug = curr.closest('div.categorydiv').find('input.category').val();
        var string = curr.closest('div.categorydiv').find('label.categoryl').text();
        // var text = string.replace(/\s+/g, "-");

        if (curr.closest('div.categorydiv').find('input.category').prop('checked') == true) {
            $('#menu_slug').prop("value", "category/"+slug+"/ad");
        }

        if ($('.category:checked').length > 1) {
            $('div.icheckbox_flat-blue').removeClass("checked");
            $('.category').prop("checked", false);
            curr.closest('div.categorydiv').find('div.icheckbox_flat-blue').addClass("checked");
            curr.closest('div.categorydiv').find('input.category').prop("checked", true);
        } else if ($('.category:checked').length == 0) {
            $('#menu_slug').prop("value", '');
        }
    }

    // Page search-tab/select on change event also automatically fill the menu slug.
    $('.page-search').on('change', function() {
        var value = $(".page-search option:selected").val();
        var text = $(".page-search option:selected").text();
        // text = text.replace(/\s+/g, "-");

        if (value == "") {
            $('#menu_slug').prop("value", '');
        } else {
            $('#menu_slug').prop("value", "page/"+value);
        }
    });

    // Category search-tab/select on change event also automatically fill the menu slug.
    $('.category-search').on('change', function() {
        var value = $(".category-search option:selected").val();
        var text = $(".category-search option:selected").text();
        // text = text.replace(/\s+/g, "-");

        if (value == "") {
            $('#menu_slug').prop("value", '');
        } else {
            $('#menu_slug').prop("value", "category/"+value+"/ad");
        }
    });


    /*
     * Script for menus/list.blade.php page.
    */

    // Initialize datatable for listing the menus from db.
    $('#menu-dataTable').DataTable({
        processing: true,
        serverSide: true,
        "responsive": true,
        ajax: base_url+'/menuslist',

        columns: [
            { data: 'id', name: 'id' },
            { data: 'name', name: 'name', orderable: false },
            { data: 'slug', name: 'slug', orderable: false },
            { data: 'parent_menu_id', orderable: false, render:function(data, type, row){ if(data == null){ return 'null'; }else{ return data; } } },
            { data: 'order', name: 'order', orderable: false },

            { data: 'id',searchable: false, orderable: false, render:function(data, type, row){ if(permissions.menu_edit || permissions.menu_delete) { return '<span  class="btn-group" role="group" aria-label="...">   <button type="button" data-value="'+data+'" class="btn btn-light menu-language" data-toggle="tooltip" title="Language"><span class="fa fa-language"></span></button>  <a href="'+base_url+'/menu/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a>  <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger menu-del" ><span class="ti-trash"></span></button> </span>'; } else { return 'No Permission'; } } }
        ],
        initComplete: function () {

        }
    });

    // click on menu language to show modal and create translation.
    $(document).on('click', '.menu-language', function(e) {
        var id = $(this).attr('data-value');
        var curr = $(this);

        $.ajax({
            type: 'GET',
            url: base_url+'/menu/trans/'+id,
            success: function(data) {
                if (data.success == false) {
                    $('#menu-alert-danger').html('<strong>'+data.message+'</strong>');
                    $('#menu-alert-danger').removeClass('d-none');
                    $("#menu-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                        $('#menu-alert-danger').addClass('d-none');
                        $("#menu-alert-danger").slideUp(500);
                    });
                } else if (data.success == true) {
                    $('#edit-language').html('');
                    $('#edit-language').append('<input type="hidden" name="menus_model_id" value="'+id+'">');
                    var clone;
                    $(data.languages).each(function(index, value) {
                        if (typeof(data.data) != "undefined") {
                            var translation = data.data[0].translations;
                            var match = translation.filter(function (translation) { return translation.locale == value.locale });
                            if (typeof(match[0]) != "undefined" && match[0].locale == value.locale) {
                                clone = '<div class="col-md-1 mt-2"><label for="'+value.locale+'" class="bold mr-2">'+value.native+'</label></div><div class="col-md-5 mb-3"><input type="text" class="form-control" id="'+value.locale+'" name="'+value.locale+'" value="'+match[0].name+'"></div>';
                            } else {
                                clone = '<div class="col-md-1 mt-2"><label for="'+value.locale+'" class="bold mr-2">'+value.native+'</label></div><div class="col-md-5 mb-3"><input type="text" class="form-control" id="'+value.locale+'" name="'+value.locale+'"></div>';
                            }
                        } else {
                            clone = '<div class="col-md-1 mt-2"><label for="'+value.locale+'" class="bold mr-2">'+value.native+'</label></div><div class="col-md-5 mb-3"><input type="text" class="form-control" id="'+value.locale+'" name="'+value.locale+'"></div>';
                        }
                        $('#edit-language').append(clone);
                    });
                    $('#menu-language-modal').modal();
                    // console.log(data);
                }
            },
            error :function(edata) {
                if (edata.success == false) {
                    $('#menu-alert-danger').removeClass('d-none');
                    $('#menu-alert-danger').html(edata.errors);
                }
            }
        });
    });

    // click on delete button to delete selected menu.
    $(document).on('click', '.menu-del', function(e) {
        var id = $(this).attr('data-value');
        var curr = $(this);

        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-times-circle-o red',
            title: 'Are you sure?',
            content: 'You want to delete this menu?',
            type: 'red',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-red',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/menu/'+id,
                            data: {_method:'DELETE'},
                            success: function(data) {
                                if (data.success == false) {
                                    $('#menu-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#menu-alert-danger').removeClass('d-none');
                                    $("#menu-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#menu-alert-danger').addClass('d-none');
                                        $("#menu-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#menu-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#menu-alert-success').removeClass('d-none');
                                    $("#menu-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#menu-alert-success').addClass('d-none');
                                        $("#menu-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/menu');
                                    }, 2000);
                                }
                            },
                            error: function(edata) {
                                if (edata.success == false) {
                                    $('#menu-alert-danger').removeClass('d-none');
                                    $('#menu-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });






    /*
     * Script for pages/create.blade.php and edit.blade.php page.
    */

    // Initialize summernote for page description.
    $('.summernote').summernote({
        placeholder: $('.summernote').attr('placeholder'),
        height: 250,
        codemirror: { // codemirror options
            theme: 'monokai'
        }
    });


    /*
     * Script for pages/list.blade.php page.
    */

    // Format of child dataTable for translation.
    function format ( d ) {
        // `d` is the original data object for the row
        return '<table class="text-center" id="trans-'+d.id+'">'+
            '<thead class="text-capitalize" style="color: black;">'+
                '<tr>'+
                    '<th>Locale</th>'+
                    '<th>Title</th>'+
                    '<th>Description</th>'+
                    '<th>Action</th>'+
                '</tr>'+
            '</thead>'+
            '<tbody>'+
            '</tbody>'+
        '</table>';
    }

    // Initialize datatable for listing the pages from db.
    var table_page = $('#page-dataTable').DataTable({
        processing: true,
        serverSide: true,
        "responsive": true,
        ajax: base_url+'/pageslist',

        columns: [
            {
                "className":      'details-control',
                "orderable":      false,
                "searchable":     false,
                "data":           null,
                "defaultContent": ''
            },
            { data: 'id', name: 'id' },
            { data: 'title', name: 'title', orderable: false },
            { data: 'description', orderable: false, render:function(data, type, row){ if(data == null) { return ''; } else { return data.replace(/<[^>]*>/g, '').substring(0, 50)+"....."; } } },
            { data: 'user_id', name: 'user_id', orderable: false },

            { data: 'id',searchable: false, orderable: false, render:function(data, type, row){ if(permissions.page_edit || permissions.page_delete) { return '<span  class="btn-group" role="group" aria-label="...">  <a href="'+base_url+'/page/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a>  <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger page-del" ><span class="ti-trash"></span></button>  </span>'; } else { return 'No Permission'; } } }

        ],
        initComplete: function () {

        }
    });

    // Add event listener for opening and closing details
    $('#page-dataTable tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table_page.row( tr );
        var tableId = 'trans-' + row.data().id;

        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            initTable(tableId, row.data());
            tr.addClass('shown');
            tr.next().find('td').addClass('no-padding bg-gray');
        }
    });

    // Initialize child table from parent table row
    function initTable(tableId, data) {
        $('#' + tableId).DataTable({
            processing: true,
            serverSide: true,
            ordering: false,
            paging: false,
            info: false,
            filter: false,
            ajax: data.details_url,
            columns: [
                { data: 'locale', name: 'locale' },
                { data: 'title', name: 'title' },
                { data: 'description', render:function(data, type, row){ if(data == null) { return ''; } else { return data.replace(/<[^>]*>/g, '').substring(0, 50)+"....."; } } },

                { data: 'id', render:function(data, type, row){ return '<a href="'+base_url+'/page/trans/'+data+'/edit" class="btn btn-xs btn-light"><i class="fa fa-edit"></i> Edit </a>'; } }
            ]
        });
    }

    // click on delete button to delete selected page.
    $(document).on('click', '.page-del', function(e) {
        var id = $(this).attr('data-value');
        var curr = $(this);

        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-times-circle-o red',
            title: 'Are you sure?',
            content: 'You want to delete this page?',
            type: 'red',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-red',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/page/'+id,
                            data: {_method:'DELETE'},
                            success: function(data) {
                                if (data.success == false) {
                                    $('#page-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#page-alert-danger').removeClass('d-none');
                                    $("#page-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#page-alert-danger').addClass('d-none');
                                        $("#page-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#page-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#page-alert-success').removeClass('d-none');
                                    $("#page-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#page-alert-success').addClass('d-none');
                                        $("#page-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/page');
                                    }, 2000);
                                }
                            },
                            error:function(edata) {
                                if (edata.success == false) {
                                    $('#page-alert-danger').removeClass('d-none');
                                    $('#page-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });








    /*
     * Script for products/create.blade.php and edit.blade.php page.
    */

    // Initialize ckeditor5 - Classic Editor for ads description
    let editorData;
    ClassicEditor
    .create( document.querySelector( '#ck-description' ), {
        toolbar: [ 'heading', '|', 'bold', 'italic', 'bulletedList', 'numberedList', 'blockquote', 'inserttable', 'undo', 'redo' ],
    } )
    .then( editor => {
        editorData = editor;
        // console.log(editor.ui.componentFactory.names());
    } )
    .catch( error => {
        console.error( error );
    });

    // Initialize multiple ckeditor5 in single page - Dashboard(Footer settings tab).
    var allEditors = document.querySelectorAll('.ck-editor');
    let editorData1 = [];
    for (var j = 0; j < allEditors.length; j++) {
        ClassicEditor.create(allEditors[j], {toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'imageupload', 'blockquote', 'inserttable', 'undo', 'redo' ]})
        .then( editor => {
            editorData1.push(editor);
        });
    }

    // When form submit, first validate the form fields with ckeditor and orakuploader.
    $('#ad-submit').on('click', function(e) {
        $("#adSubmitForm").validate({
            errorPlacement: function(error,element) {
                return true;
            }
        });

        // Must choose the category before submit
        // if ($('input[name="category_id"]').length == 0) {
        //     e.preventDefault();
        //     alert("Please must choose the category.");
        // } else {
        if ($("#adSubmitForm").valid() === false) {
            // ckeditor validation
            if (editorData.getData() == "<p>&nbsp;</p>") {
                $('.ck.ck-editor__main').css("border", "1px solid #dc3545");
            } else {
                $('.ck.ck-editor__main').css("border", "1px solid #28a745");
            }
            // orakuploader validation
            if ($('#product_images > div.file').length == 0) {
                $('.multibox.uploadButton').css("border", "1px solid #dc3545");
            } else {
                $('.multibox.uploadButton').css("border", "1px solid #28a745");
            }
        } else {
            if (editorData.getData() == "<p>&nbsp;</p>") {
                $('.ck.ck-editor__main').css("border", "1px solid #dc3545");
                e.preventDefault();
            } else {
                $('.ck.ck-editor__main').css("border", "1px solid #28a745");
            }

            if ($('#product_images > div.file').length == 0) {
                $('.multibox.uploadButton').css("border", "1px solid #dc3545");
                e.preventDefault();
            } else {
                $('.multibox.uploadButton').css("border", "1px solid #28a745");
            }
        }
        // }
    });

    // Click on choose category to select category and selected category get the customfields for ads.
    $('.choose-category').on('click', function(e) {
        e.preventDefault();
        var id = $(this).attr('data-value');

        $.ajax({
            type: 'GET',
            cache: false,
            processData: false,
            contentType: false,
            url: base_url+'/product/category/'+id,
            success: function(data) {
                if (data.success == true) {
                    if (data.details == false) {
                        $('.ad-details-attributes').addClass('d-none');
                    } else {
                        $('.ad-details-attributes').removeClass('d-none');
                    }
                    var string = data.message;
                    $('#attributes').html(string);
                    $('#category-section').addClass('d-none');
                    $('#productForm').removeClass('d-none');
                    $('#breadcrumbs-category').removeClass('d-none');

                    $('.child_menu').html('&nbsp;'+data.child);
                    if (data.parent.length > 0) {
                        $.each(data.parent, function(index, item) {
                            $('.parent_menu').html('<li><a>'+item+'</a></li>');
                        });
                    } else {
                        $('.parent_menu').html('');
                    }
                }
            },
            error: function(edata) {
                if (edata.success == false) {
                    $('#attribute-alert-danger').removeClass('d-none');
                    $('#attribute-alert-danger').html(edata.errors);
                }
            }
        });
    });

    // click on change button to show the menu for choose category.
    $('#btn-change').on('click', function(e) {
        $('#category-section').removeClass('d-none');
    });


    /*
     * Script for products/edit.blade.php file.
    */

    // set total image, max upload image, storing images for orakuploader ads images.
    var images = [];
    var total_image = $('span.orakImage').length;
    var max_upload;
    var total_max_upload = settings.max_upload_image;
    $('span.orakImage').each(function(index, value) {
        if (total_image >= total_max_upload) {
            max_upload = 0;
        } else {
            max_upload = total_max_upload - total_image;
        }
        images[index] = $(this).text();
    });

    if (images.length > 0) {
        // Initialize orakuploader for uploading ads images
        $('#product_images').orakuploader({
            orakuploader_path : orakuploader_storage_path,

            orakuploader_main_path : orakuploader_storage_path+'files',
            orakuploader_thumbnail_path : orakuploader_storage_path+'files/tn',

            orakuploader_use_main : true,
            orakuploader_use_sortable : true,
            // orakuploader_use_dragndrop : true,
            orakuploader_use_rotation: true,

            orakuploader_add_image : orakuploader_add_image_path,
            orakuploader_add_label : 'Browse for images',

            // orakuploader_resize_to : 1000,
            orakuploader_thumbnail_size  : 238.13,

            orakuploader_maximum_uploads : max_upload,
            orakuploader_hide_on_exceed : true,

            orakuploader_attach_images: images,

            orakuploader_watermark : settings.watermark,

            orakuploader_max_exceeded : function() {
                alert("You exceeded the max. limit of "+total_max_upload+" images.");
            }
        });
    } else {
        // Initialize orakuploader for uploading ads images
        $('#product_images').orakuploader({
            orakuploader_path : orakuploader_storage_path,

            orakuploader_main_path : orakuploader_storage_path+'files',
            orakuploader_thumbnail_path : orakuploader_storage_path+'files/tn',

            orakuploader_use_main : true,
            orakuploader_use_sortable : true,
            // orakuploader_use_dragndrop : true,
            orakuploader_use_rotation: true,

            orakuploader_add_image : orakuploader_add_image_path,
            orakuploader_add_label : 'Browse for images',

            // orakuploader_resize_to : 1000,
            orakuploader_thumbnail_size  : 238.13,

            orakuploader_maximum_uploads : settings.max_upload_image,
            orakuploader_hide_on_exceed : true,

            orakuploader_watermark : settings.watermark,

            orakuploader_max_exceeded : function() {
                alert("You exceeded the max. limit of "+settings.max_upload_image+" images.");
            }
        });
    }

    // When form update, first validate the form fields with ckeditor and orakuploader.
    $('#ad-update').on('click', function(e) {
        $("#adUpdateForm").validate({
            errorPlacement: function(error,element) {
                return true;
            }
        });

        // Must choose the category before submit
        if ($('input[name="category_id"]').length == 0) {
            e.preventDefault();
            alert("Please must choose the category.");
        } else {
            console.log($("#adUpdateForm").valid());
            if ($("#adUpdateForm").valid() === false) {
                // ckeditor validation
                if (editorData.getData() == "<p>&nbsp;</p>") {
                    $('.ck.ck-editor__main').css("border", "1px solid #dc3545");
                } else {
                    $('.ck.ck-editor__main').css("border", "1px solid #28a745");
                }
                // orakuploader validation
                if ($('#product_images > div.file').length == 0) {
                    $('.multibox.uploadButton').css("border", "1px solid #dc3545");
                } else {
                    $('.multibox.uploadButton').css("border", "1px solid #28a745");
                }
            } else {
                if (editorData.getData() == "<p>&nbsp;</p>") {
                    $('.ck.ck-editor__main').css("border", "1px solid #dc3545");
                    e.preventDefault();
                } else {
                    $('.ck.ck-editor__main').css("border", "1px solid #28a745");
                }

                if ($('#product_images > div.file').length == 0) {
                    $('.multibox.uploadButton').css("border", "1px solid #dc3545");
                    e.preventDefault();
                } else {
                    $('.multibox.uploadButton').css("border", "1px solid #28a745");
                }
            }
        }
    });

    // show the breadcrumbs selected category for the specific ad and click to edit it.
    var id = $('input[name="category_id"]').val();
    if (id) {
        $.ajax({
            type: 'GET',
            cache: false,
            processData: false,
            contentType: false,
            url: base_url+'/product/category/'+id,
            success: function(data) {
                if (data.success == true) {
                    var string = data.message;
                    $('#category-section').addClass('d-none');
                    $('#breadcrumbs-category').removeClass('d-none');

                    $('.child_menu').html('&nbsp;'+data.child);
                    $.each(data.parent, function(index, item) {
                        $('.parent_menu').html('<li><a>'+item+'</a></li>');
                    });
                }
            },
            error: function(edata) {
                if (edata.success == false) {
                    $('#attribute-alert-danger').removeClass('d-none');
                    $('#attribute-alert-danger').html(edata.errors);
                }
            }
        });
    }


    /*
     * Script for products/list.blade.php file.
    */

    // Format of child dataTable for translation.
    function format_p ( d ) {
        // `d` is the original data object for the row
        return '<table class="text-center" id="trans-'+d.id+'">'+
            '<thead class="text-capitalize" style="color: black;">'+
                '<tr>'+
                    '<th>Locale</th>'+
                    '<th>Title</th>'+
                    '<th>Description</th>'+
                    '<th>Action</th>'+
                '</tr>'+
            '</thead>'+
            '<tbody>'+
            '</tbody>'+
        '</table>';
    }

    // Initialize datatable for ads list from db.
    var product_table = $('#product-dataTable').DataTable({
        processing: true,
        serverSide: true,
        "responsive": true,
        ajax: base_url+'/productslist',

        columns: [
            {
                "className":      'details-control',
                "orderable":      false,
                "searchable":     false,
                "data":           null,
                "defaultContent": ''
            },
            { data: 'id', name: 'id' },
            { data: 'title', name: 'title', orderable: false },
            { data: 'description', orderable: false, render:function(data, type, row){ if(data == null) { return 'No Description'; } else { return data.replace(/<[^>]*>/g, '').substring(0, 50)+"....."; } } },
            { data: 'price', name: 'price', orderable: false },
            // { data: 'quantity', name: 'quantity', orderable: false },
            { data: 'status', orderable: false, render:function(data, type, row){ if(data == 'Approve') { return '<span class="text-success">'+data.charAt(0).toUpperCase() + data.slice(1)+'</span>'; } else if (data == 'Pending') { return '<span class="text-warning">'+data.charAt(0).toUpperCase() + data.slice(1)+'</span>'; } else if (data == 'Block') { return '<span class="text-danger">'+data.charAt(0).toUpperCase() + data.slice(1)+'</span>'; } else { return '<span class="text-default">'+data.charAt(0).toUpperCase() + data.slice(1)+'</span>' } } },
            // { data: 'featured', orderable: false, render:function(data, type, row){ if(data == 0){ return '<span class="btn"><i class="fa fa-toggle-off featured-ad fa-3x t-red" data-value="'+row.id+'"></i></span>'; }else{ return '<span class="btn"><i class="fa fa-toggle-on featured-ad fa-3x t-green" data-value="'+row.id+'"></i></span>'; } } },
            { data: 'featured', orderable: false, render: function(data, type, row){ var badges = ''; if(row.featured == '1') { badges += '<h6><span class="badge badge-pill badge-success">Featured</span></h6>'; } if(row.urgent == '1') { badges += '<h6><span class="badge badge-pill badge-warning">Urgent</span></h6>'; } if(row.highlight == '1') { badges += '<h6><span class="badge badge-pill badge-info">Highlight</span></h6>'; } return badges; } },

            { data: 'id',searchable: false, orderable: false, render:function(data, type, row){ if(permissions.product_edit || permissions.product_delete) { if(row.status == 'Approve' || row.status == 'Expire'){ return '<span  class="btn-group" role="group" aria-label="...">  <a href="#" class="btn btn-link btnApprove reject" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Reject" style="text-decoration: none;"> <i class="ti-check text-success" style="font-size: 18px;"></i></a> <a href="'+base_url+'/product/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a>  <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger ad-del" ><span class="ti-trash"></span></button> </span>'; } else { return '<span  class="btn-group" role="group" aria-label="..."> <a href="#" class="btn btn-link btnApprove" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Approve" style="text-decoration: none;"> <i class="ti-close text-danger" style="font-size: 18px;"></i></a> <a href="'+base_url+'/product/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a>  <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger ad-del" ><span class="ti-trash"></span></button> </span>'; } } else { return 'No Permission' } } }
        ],
        initComplete: function () {

        }
    });

    // Add event listener for opening and closing details
    $('#product-dataTable tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = product_table.row( tr );
        var tableId = 'trans-' + row.data().id;

        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format_p(row.data()) ).show();
            initAdTable(tableId, row.data());
            tr.addClass('shown');
            tr.next().find('td').addClass('no-padding bg-gray');
        }
    });

    // Initialize child table from parent table row
    function initAdTable(tableId, data) {
        $('#' + tableId).DataTable({
            processing: true,
            serverSide: true,
            ordering: false,
            paging: false,
            info: false,
            filter: false,
            ajax: data.details_url,
            columns: [
                { data: 'locale', name: 'locale' },
                { data: 'title', name: 'title' },
                { data: 'description', render:function(data, type, row){ if(data == null) { return ''; } else { return data.replace(/<[^>]*>/g, '').substring(0, 50)+"....."; } } },

                { data: 'id', render:function(data, type, row){ return '<a href="'+base_url+'/product/trans/'+data+'/edit" class="btn btn-xs btn-light"><i class="fa fa-edit"></i> Edit </a>'; } }
            ]
        });
    }

    // Click to ads featured or not
    $(document).on('click', '.featured-ad', function(e) {
        var id = $(this).attr('data-value');

        if ($(this).hasClass('fa-toggle-on')) {
            $(this).removeClass('fa-toggle-on');
            $(this).addClass('fa-toggle-off');
            $(this).removeClass('t-green');
            $(this).addClass('t-red');
        } else {
            $(this).removeClass('fa-toggle-off');
            $(this).addClass('fa-toggle-on');
            $(this).removeClass('t-red');
            $(this).addClass('t-green');
        }

        $.ajax({
            type: 'POST',
            url: base_url+'/product/'+id+'/featured',
            success: function(data) {
                if (data.success == false) {
                    $('#product-alert-danger').html('<strong>'+data.message+'</strong>');
                    $('#product-alert-danger').removeClass('d-none');
                    $("#product-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                        $('#product-alert-danger').addClass('d-none');
                        $("#product-alert-danger").slideUp(500);
                    });
                } else if (data.success == true) {
                    $('#product-alert-success').html('<strong>'+data.message+'</strong>');
                    $('#product-alert-success').removeClass('d-none');
                    $("#product-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                        $('#product-alert-success').addClass('d-none');
                        $("#product-alert-success").slideUp(500);
                    });
                }
            },
            error: function(edata) {
                if (edata.success == false) {
                    $('#product-alert-danger').removeClass('d-none');
                    $('#product-alert-danger').html(edata.errors);
                }
            }
        });
    });

    // Click to ads approve or reject
    $(document).on('click', '.btnApprove', function(e) {
        e.preventDefault();
        var id = $(this).attr('data-value');

        if ($(this).hasClass('reject')) {
            var dataC = 'You want to <strong> Reject </strong> this ad?';
        } else {
            var dataC = 'You want to <strong> Approve </strong> this ad?';
        }
        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-warning',
            title: 'Are you sure?',
            content: dataC,
            type: 'orange',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-orange',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/product/'+id+'/status',
                            success: function(data) {
                                if (data.success == false) {
                                    $('#product-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#product-alert-danger').removeClass('d-none');
                                    $("#product-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#product-alert-danger').addClass('d-none');
                                        $("#product-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('body, html').animate({scrollTop:$('body').offset().top}, 'slow');
                                    $('#product-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#product-alert-success').removeClass('d-none');
                                    $("#product-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#product-alert-success').addClass('d-none');
                                        $("#product-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/product');
                                    }, 2000);
                                }
                            },
                            error: function(edata) {
                                if (edata.success == false) {
                                    $('#product-alert-danger').removeClass('d-none');
                                    $('#product-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });

    // click on delete button to delete selected ad and it's details and images.
    $(document).on('click', '.ad-del', function(e) {
        var id = $(this).attr('data-value');
        var curr = $(this);

        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-times-circle-o red',
            title: 'Are you sure?',
            content: 'You want to delete this product and also it\'s details?',
            type: 'red',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-red',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/product/'+id,
                            data: {_method:'DELETE'},
                            success: function(data) {
                                if (data.success == false) {
                                    $('#product-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#product-alert-danger').removeClass('d-none');
                                    $("#product-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#product-alert-danger').addClass('d-none');
                                        $("#product-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#product-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#product-alert-success').removeClass('d-none');
                                    $("#product-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#product-alert-success').addClass('d-none');
                                        $("#product-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/product');
                                    }, 2000);
                                }
                            },
                            error: function(edata) {
                                if(edata.success == false){
                                    $('#product-alert-danger').removeClass('d-none');
                                    $('#product-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });






    /*
     * Script for products/report/list.blade.php file.
    */

    // Initialize datatable for report violation list from db.
    $('#report-dataTable').DataTable({
        processing: true,
        serverSide: true,
        "responsive": true,
        ajax: base_url+'/reportslist',

        columns: [
            { data: 'id', name: 'id' },
            { data: 'user.username', name: 'user.username', orderable: false },
            // { data: 'reporter_email', name: 'reporter_email', orderable: false },
            { data: 'violation_type', name: 'violation_type', orderable: false },
            { data: 'reporting_username', name: 'reporting_username', orderable: false },
            { data: 'ad.id', orderable: false, render:function(data, type, row){ return '<a href="'+site_url+'/ad-details/'+data+'">'+row.ad.title+'</a>'; } },
            { data: 'status', orderable: false, render:function(data, type, row){ if(data == 'approve') { return '<span class="text-success">'+data.charAt(0).toUpperCase() + data.slice(1)+'</span>'; } else if (data == 'reject') { return '<span class="text-danger">'+data.charAt(0).toUpperCase() + data.slice(1)+'</span>'; } else { return '<span class="text-warning">'+data.charAt(0).toUpperCase() + data.slice(1)+'</span>'; } } },

            { data: 'id',searchable: false, orderable: false, render:function(data, type, row){ if(permissions.approve_report_violation) { if(row.status == 'pending' || row.status == 'reject'){ return '<span  class="btn-group" role="group" aria-label="...">  <a href="'+base_url+'/report/'+data+'/edit" class="btn btn-link btnReportStatus1" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Approve" style="text-decoration: none;"> <span class="badge badge-success p-2">Approve</span></a>  <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger report-del" ><span class="ti-trash"></span></button> </span>'; } else { return '<span  class="btn-group" role="group" aria-label="..."> <a href="'+base_url+'/report/'+data+'/edit" class="btn btn-link btnReportStatus1 reject" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Reject" style="text-decoration: none;"> <span class="badge badge-danger p-2">Reject</span></a>  <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger report-del" ><span class="ti-trash"></span></button> </span>'; } } else { return 'No Permission'; } } }
        ],
        initComplete: function () {

        }
    });

    // Click to change the status of report violation approve or reject
    $(document).on('click', '.btnReportStatus', function(e) {
        var id = $(this).attr('data-value');

        if ($(this).hasClass('reject')) {
            var dataC = 'You want to <strong> Reject </strong> this report?';
        } else {
            var dataC = 'You want to <strong> Approve </strong> this report?';
        }
        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-warning',
            title: 'Are you sure?',
            content: dataC,
            type: 'orange',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-orange',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/report/'+id+'/status',
                            success: function(data) {
                                if (data.success == false) {
                                    $('#report-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#report-alert-danger').removeClass('d-none');
                                    $("#report-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#report-alert-danger').addClass('d-none');
                                        $("#report-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#report-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#report-alert-success').removeClass('d-none');
                                    $("#report-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#report-alert-success').addClass('d-none');
                                        $("#report-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/report');
                                    }, 2000);
                                }
                            },
                            error: function(edata) {
                                if (edata.success == false) {
                                    $('#report-alert-danger').removeClass('d-none');
                                    $('#report-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });

    // click on delete button to delete selected report violation ad.
    $(document).on('click', '.report-del', function(e) {
        var id = $(this).attr('data-value');
        var curr = $(this);

        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-times-circle-o red',
            title: 'Are you sure?',
            content: 'You want to delete this report?',
            type: 'red',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-red',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/report/'+id,
                            data: {_method:'DELETE'},
                            success: function(data) {
                                if (data.success == false) {
                                    $('#report-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#report-alert-danger').removeClass('d-none');
                                    $("#report-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#report-alert-danger').addClass('d-none');
                                        $("#report-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#report-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#report-alert-success').removeClass('d-none');
                                    $("#report-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#report-alert-success').addClass('d-none');
                                        $("#report-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/report');
                                    }, 2000);
                                }
                            },
                            error: function(edata) {
                                if(edata.success == false){
                                    $('#report-alert-danger').removeClass('d-none');
                                    $('#report-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });



    /*
     * Script for products/report/edit.blade.php file.
    */

    // Initialize datepicker for choosing the block ad date range.
    $('.datepicker').datepicker({
        format: "yyyy-mm-dd",
        clearBtn: true,
        todayHighlight: true
    });

    // onChange the report status to enable/disable the date-range.
    $('#status').on('change', function(e) {
        if ($(this).val() == 'approve') {
            $('.date-range').removeClass('d-none');
            $('.datepicker').attr('disabled', false);
        } else {
            $('.date-range').addClass('d-none');
            $('.datepicker').attr('disabled', true);
        }
    });







    /*
     * Script for settings/setting.blade.php file.
    */

    // If selected watermark is enable, then showing the watermark image and position fields.
    $('#watermark').change(function(e) {
        if ($(this).val() == 'Disable') {
            $('.watermark_image').hide(500);
            $('#watermark_image').prop('disabled', true);
            $('.watermark_position').hide(500);
            $('#watermark_position').prop('disabled', true);
        } else {
            $('.watermark_image').show(500);
            $('#watermark_image').prop('disabled', false);
            $('.watermark_position').show(500);
            $('#watermark_position').prop('disabled', false);
        }
    });

    // If setting has disabled the watermark, then hide the watermark image and position fields.
    if (settings.watermark == 'Disable') {
        $('.watermark_image').hide(500);
        $('#watermark_image').prop('disabled', true);
        $('.watermark_position').hide(500);
        $('#watermark_position').prop('disabled', true);
    }

    // Cloning the footer section
    function footerSectionClone(i) {
        return '<div class="col-md-12 mt-2">'+
                    '<h4 class="header-title mt-4"> <i class="ti-menu cursorMove parent"></i> <span class="section-title">Section '+i+'</span> <i class="ti-trash trash-style float-right del-footer-section"></i> </h4>'+

                    '<label for="footer_section_title_'+i+'" class="required fnt-wt">Title</label>'+
                    '<input type="text" class="form-control" name="footer_section_title[]" id="footer_section_title_'+i+'" placeholder="Enter title" required>'+

                    '<label for="footer_section_description_'+i+'" class="required fnt-wt mt-2">Description</label>'+
                    '<textarea class="form-control ck-editor" name="footer_section_description[]" id="footer_section_description_'+i+'" rows="8" cols="80"></textarea>'+

                    '<label for="footer_section_newsletter_'+i+'" class="fnt-wt mt-2">Add Newsletter to this section?</label>'+
                    '<div class="clearfix"></div>'+
                    '<input type="checkbox" class="toggle-switch" value="yes" id="footer_section_newsletter_'+i+'" name="footer_section_newsletter[]" data-toggle="toggle" data-on="Yes" data-off="No" data-onstyle="success" data-offstyle="danger">'+
                '</div>';
    }

    // Initialize multiple ckeditor for footer sections description.
    function ckeditorInit(id) {
        ClassicEditor.create(document.querySelector('#footer_section_description_'+id), {toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'imageupload', 'blockquote', 'inserttable', 'undo', 'redo' ]})
        /*.then( editor => {
            editorData1.push(editor);
        })*/;
    }

    // Show or hide Add Section button.
    function sectionButton(select_footer_value) {
        if (select_footer_value == null) {
            var footerSections = settings.footer_sections;
        } else {
            var footerSections = select_footer_value;
        }
        var footerSectionsSetting = $('.footer-sections > div').length;

        if (footerSectionsSetting < footerSections) {
            $('.btnAddSection').removeClass('d-none');
        } else {
            $('.btnAddSection').addClass('d-none');
        }
    }

    sectionButton(null);

    // Select number of sections to change the section details below the select element.
    $('#footer_sections').on('change', function(e) {
        sectionButton($(this).val());
    });

    // Append clone section to the last of the div.
    $('.btnAddSection').on('click', function(e) {
        var index = ($('.footer-sections > div').length+1);
        $('.footer-sections').append(footerSectionClone(index)).hide().fadeIn(2000);
        ckeditorInit(index);
        sectionButton($('#footer_sections').val());
        $('.toggle-switch').bootstrapToggle();

        $('.del-footer-section').on('click', function(e) {
            if ($(this).attr('data-row') == undefined) {
                $(this).closest('div.col-md-12').fadeOut( "slow", function() {
                    $(this).remove();
                    sectionButton($('#footer_sections').val());
                });
            }
        });
    });

    // Sort the footer sections with also changing the number of section.
    $( ".ui-sortable-footer-sections" ).sortable({
        handle: 'i.parent',

        start: function(event, ui) {
            ui.item.startPos = ui.item.index();
        },
        stop: function (event, ui) {
            // change section title
            ui.item.find('.section-title').text('Section '+(ui.item.index()+1));
            ui.item.prev().find('.section-title').text('Section '+ui.item.index());
            ui.item.prev().prev().find('.section-title').text('Section '+(ui.item.index()-1));
            ui.item.prev().prev().prev().find('.section-title').text('Section '+(ui.item.index()-2));
            ui.item.next().find('.section-title').text('Section '+(ui.item.index()+2));
            ui.item.next().next().find('.section-title').text('Section '+(ui.item.index()+3));
            ui.item.next().next().next().find('.section-title').text('Section '+(ui.item.index()+4));
        },
        update: function (event, ui) {

        }
    }).disableSelection();

    // Click to delete the specific section from database setting and also remove it's element.
    $('.del-footer-section').on('click', function(e) {
        var index = $(this).attr('data-row');

        var data = [];
        data.push('footer_section_title.'+index);
        data.push('footer_section_description.'+index);
        data.push('footer_section_newsletter.'+index);

        $.ajax({
            type: 'POST',
            url: base_url+'/setting/delete',
            data: {data: data},
            success: function(data) {
                if (data.success == false) {
                    $('body, html').animate({scrollTop:$('body').offset().top}, 'slow');
                    $('#setting-alert-danger').html('<strong>'+data.message+'</strong>');
                    $('#setting-alert-danger').removeClass('d-none');
                    $("#setting-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                        $('#setting-alert-danger').addClass('d-none');
                        $("#setting-alert-danger").slideUp(500);
                    });
                } else if (data.success == true) {
                    $('body, html').animate({scrollTop:$('body').offset().top}, 'slow');
                    $('#setting-alert-success').html('<strong>'+data.message+'</strong>');
                    $('#setting-alert-success').removeClass('d-none');
                    $("#setting-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                        $('#setting-alert-success').addClass('d-none');
                        $("#setting-alert-success").slideUp(500);
                    });
                    setTimeout(function() {
                        window.location.replace(base_url+'/setting');
                    }, 2000);
                }
            },
            error: function(edata) {
                if (edata.success == false) {
                    $('#setting-alert-danger').removeClass('d-none');
                    $('#setting-alert-danger').html(edata.errors);
                }
            }
        });
    });

    // First validate ckeditor5 before submit
    $('#setting-update').on('click', function(e) {
        console.log('clicked');
        if ($("#settingForm").valid() === true) {
            $(".footer-sections div.col-md-12").each(function () {
                if ($(this).find("input[type=checkbox]").prop("checked") == true) {
                    $(this).find("input[type=checkbox]").val('yes');
                } else if ($(this).find("input[type=checkbox]").prop("checked") == false) {
                    $(this).find("input[type=checkbox]").prop("checked", true);
                    $(this).find("input[type=checkbox]").val('no');
                }
            });
        }
    });





    /*
     * Script for categories/create.blade.php and edit.blade.php file.
    */

    // Initialize the fontawesome iconpicker
    $('.icon-picker').iconpicker({placement: 'top', animation: true, hideOnSelect: true});


    /*
     * Script for categories/list.blade.php file.
    */

    // Initialize datatable for listing the categories.
    $('#category-dataTable').DataTable({
        processing: true,
        serverSide: true,
        "responsive": true,
        ajax: base_url+'/categorieslist',

        columns: [
            { data: 'id', name: 'id' },
            { data: 'category_name', name: 'category_name', orderable: false },
            { data: 'parent_cat_id', name: 'parent_cat_id', orderable: false },
            { data: 'order', name: 'order', orderable: false },

            { data: 'id',searchable: false, orderable: false, render:function(data, type, row){ if(permissions.category_edit && permissions.category_delete) { return '<span  class="btn-group" role="group" aria-label="...">    <button type="button" data-value="'+data+'" class="btn btn-light category-language" data-toggle="tooltip" title="Language"><span class="fa fa-language"></span></button>  <a href="'+base_url+'/category/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a> <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger category-del" ><span class="ti-trash"></span></button>  </span>'; } else { return 'No Permission'; } } }
        ],
        initComplete: function () {

        }
    });

    // click on delete button to delete selected category and also it's attributes.
    $(document).on('click', '.category-language', function(e) {
        var id = $(this).attr('data-value');
        var curr = $(this);

        $.ajax({
            type: 'GET',
            url: base_url+'/categories/trans/'+id,
            // data: {_method:'DELETE'},
            success: function(data) {
                if (data.success == false) {
                    $('#category-alert-danger').html('<strong>'+data.message+'</strong>');
                    $('#category-alert-danger').removeClass('d-none');
                    $("#category-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                        $('#category-alert-danger').addClass('d-none');
                        $("#category-alert-danger").slideUp(500);
                    });
                } else if (data.success == true) {
                    $('#edit-language').html('');
                    $('#edit-language').append('<input type="hidden" name="category_id" value="'+id+'">');
                    var clone;
                    $(data.languages).each(function(index, value) {
                        if (typeof(data.data) != "undefined") {
                            var translation = data.data[0].translations;
                            var match = translation.filter(function (translation) { return translation.locale == value.locale });
                            if (typeof(match[0]) != "undefined" && match[0].locale == value.locale) {
                                clone = '<div class="col-md-1 mt-2"><label for="'+value.locale+'" class="bold mr-2">'+value.native+'</label></div><div class="col-md-5 mb-3"><input type="text" class="form-control" id="'+value.locale+'" name="'+value.locale+'" value="'+match[0].category_name+'"></div>';
                            } else {
                                clone = '<div class="col-md-1 mt-2"><label for="'+value.locale+'" class="bold mr-2">'+value.native+'</label></div><div class="col-md-5 mb-3"><input type="text" class="form-control" id="'+value.locale+'" name="'+value.locale+'"></div>';
                            }
                        } else {
                            clone = '<div class="col-md-1 mt-2"><label for="'+value.locale+'" class="bold mr-2">'+value.native+'</label></div><div class="col-md-5 mb-3"><input type="text" class="form-control" id="'+value.locale+'" name="'+value.locale+'"></div>';
                        }
                        $('#edit-language').append(clone);
                    });
                    $('#category-language-modal').modal();
                    console.log(data);
                }
            },
            error :function(edata) {
                if (edata.success == false) {
                    $('#category-alert-danger').removeClass('d-none');
                    $('#category-alert-danger').html(edata.errors);
                }
            }
        });
    });

    // click on delete button to delete selected category and also it's attributes.
    $(document).on('click', '.category-del', function(e) {
        var id = $(this).attr('data-value');
        var curr = $(this);

        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-times-circle-o red',
            title: 'Are you sure?',
            content: 'You want to delete this category and also it\'s attributes?',
            type: 'red',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-red',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/category/'+id,
                            data: {_method:'DELETE'},
                            success: function(data) {
                                if (data.success == false) {
                                    $('#category-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#category-alert-danger').removeClass('d-none');
                                    $("#category-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#category-alert-danger').addClass('d-none');
                                        $("#category-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#category-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#category-alert-success').removeClass('d-none');
                                    $("#category-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#category-alert-success').addClass('d-none');
                                        $("#category-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/category');
                                    }, 2000);
                                }
                            },
                            error :function(edata) {
                                if (edata.success == false) {
                                    $('#category-alert-danger').removeClass('d-none');
                                    $('#category-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });





    /*
     * Script for slider/create.blade.php and edit.blade.php file.
    */

    // Multiple images preview in browser
    var imagesPreview = function(input, placeToInsertImagePreview) {

        if (input.files) {
            $.each(input.files, function(i, item) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    var slide = '<div class="col-lg-3 col-md-3 col-sm-3 mt-3" id="slides_image_id">'+
                                    '<div class="slide-image">'+
                                        '<img src="'+event.target.result+'" class="img img-thumbnail" style="border: 0px solid">'+
                                    '</div>'+

                                    '<label class="required bold">Title</label>'+
                                    '<input type="text" name="title[]" class="form-control slide-image-fields" required>'+

                                    '<label class="bold">Description</label>'+
                                    '<textarea name="description[]" class="form-control" rows="4" cols="80"></textarea>'+

                                    '<label class="required bold">Order</label>'+
                                    '<input type="number" name="order[]" class="form-control slide-image-fields" min="1" required>'+

                                    '<label class="bold">Link</label>'+
                                    '<input type="text" name="link[]" class="form-control slide-image-fields">'+
                                '</div>';
                    var $clone = $(slide);
                    $clone.find("input.icheck-g").iCheck({checkboxClass: 'icheckbox_minimal-green'});
                    $($clone).appendTo(placeToInsertImagePreview);
                }
                reader.readAsDataURL(input.files[i]);
            });
        }
    };

    // Set total image, max upload image, get stored images for slider images.
    var s_total_image = $('span.sliderImage').length;
    var s_max_upload;
    var s_total_max_upload = settings.max_slider_image;
    $('span.sliderImage').each(function(index, value) {
        if (s_total_image >= s_total_max_upload) {
            s_max_upload = 0;
        } else {
            s_max_upload = s_total_max_upload - s_total_image;
        }
    });

    // pick slider images and preview in the row to add it's details.
    $('#slider_images').on('change', function() {
        var input = this;
        $('#gallery').html('');

        if (input.files.length > s_total_max_upload) {
            alert("You exceeded the max. limit of "+s_total_max_upload+" images.");
            $('#slider_images').val('');
        } else {
            imagesPreview(input, 'div#gallery');
        }
    });

    $('#slider_images_edit').on('change', function() {
        var input = this;
        $('#gallery-edit').html('');

        if (input.files.length > s_max_upload) {
            alert("You exceeded the max. limit of "+s_total_max_upload+" images.");
            $('#slider_images_edit').val('');
        } else {
            imagesPreview(input, 'div#gallery-edit');
        }
    });

    // click on slider image close to delete image from storaage and database.
    $('.slider-image-close').on('click', function(e) {
        var id = $(this).attr('data-slide-id');

        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-warning',
            title: 'Are you sure?',
            content: 'You want to delete this slide?',
            type: 'red',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-red',
                    action: function() {
                        $.ajax({
                            type: 'GET',
                            url: base_url+'/slider/delete_slide/'+id,
                            success: function(data) {
                                if (data.success == false) {
                                    $('#slider-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#slider-alert-danger').removeClass('d-none');
                                    $("#slider-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#slider-alert-danger').addClass('d-none');
                                        $("#slider-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#slider-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#slider-alert-success').removeClass('d-none');
                                    $("#slider-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#slider-alert-success').addClass('d-none');
                                        $("#slider-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.reload();
                                    }, 2000);
                                }
                            },
                            error: function(edata) {
                                if (edata.success == false) {
                                    $('#slider-alert-danger').removeClass('d-none');
                                    $('#slider-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });



    /*
     * Script for slider/list.blade.php file.
    */

    // Initialize datatable for slider list from db.
    $('#slider-dataTable').DataTable({
        processing: true,
        serverSide: true,
        "responsive": true,
        ajax: base_url+'/sliderlist',

        columns: [
            { data: 'id', name: 'id' },
            { data: 'name', name: 'name', orderable: false },
            { data: 'slides_per_page', name: 'slides_per_page', orderable: false },
            { data: 'auto_play', name: 'auto_play', orderable: false, render:function(data, type, row){ if(data == 1){ return 'true'; }else{ return 'false'; } } },
            { data: 'autoplay_timeout', name: 'autoplay_timeout', orderable: false },
            { data: 'is_active', orderable: false, render:function(data, type, row){ if(data == 1){ return '<span class="text-success">Active</span>'; }else{ return '<span class="text-danger">Deactive</span>'; } } },

            { data: 'id',searchable: false, orderable: false, render:function(data, type, row){ if(permissions.slider_edit || permissions.slider_delete) { if(row.is_active == 1){ return '<span  class="btn-group" role="group" aria-label="..."> <a href="#" class="btn btn-link btnSliderActive deactive" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Deactivate"> <span class="fa fa-toggle-on"></span></a>  <a href="'+base_url+'/slider/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a> <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger slider-del" ><span class="ti-trash"></span></button> </span>'; } else { return '<span  class="btn-group" role="group" aria-label="..."> <a href="#" class="btn btn-link btnSliderActive" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Activate"> <span class="fa fa-toggle-off"></span></a>  <a href="'+base_url+'/slider/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a> <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger slider-del" ><span class="ti-trash"></span></button> </span>'; } } else {return 'No Permission'} } }
        ],
        initComplete: function () {

        }
    });

    // Click the btnSliderActive to active or deactive the sliders.
    $(document).on('click', '.btnSliderActive', function(e) {
        var id = $(this).attr('data-value');

        if ($(this).hasClass('deactive')) {
            var dataC = 'You want to <strong> Deactivate </strong> this slider?';
        } else {
            var dataC = 'You want to <strong> Activate </strong> this slider?';
        }
        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-warning',
            title: 'Are you sure?',
            content: dataC,
            type: 'orange',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-orange',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/slider/'+id+'/status',
                            success: function(data) {
                                if (data.success == false) {
                                    $('#slider-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#slider-alert-danger').removeClass('d-none');
                                    $("#slider-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#slider-alert-danger').addClass('d-none');
                                        $("#slider-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#slider-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#slider-alert-success').removeClass('d-none');
                                    $("#slider-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#slider-alert-success').addClass('d-none');
                                        $("#slider-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/slider');
                                    }, 2000);
                                }
                            },
                            error: function(edata) {
                                if (edata.success == false) {
                                    $('#slider-alert-danger').removeClass('d-none');
                                    $('#slider-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });

    // click on delete button to delete selected slider and it's images.
    $(document).on('click', '.slider-del', function(e) {
        var id = $(this).attr('data-value');
        var curr = $(this);

        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-times-circle-o red',
            title: 'Are you sure?',
            content: 'You want to delete this slider and its images?',
            type: 'red',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-red',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/slider/'+id,
                            data: {_method:'DELETE'},
                            success: function(data) {
                                if (data.success == false) {
                                    $('#slider-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#slider-alert-danger').removeClass('d-none');
                                    $("#slider-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#slider-alert-danger').addClass('d-none');
                                        $("#slider-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#slider-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#slider-alert-success').removeClass('d-none');
                                    $("#slider-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#slider-alert-success').addClass('d-none');
                                        $("#slider-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/slider');
                                    }, 2000);
                                }
                            },
                            error: function(edata) {
                                if(edata.success == false){
                                    $('#slider-alert-danger').removeClass('d-none');
                                    $('#slider-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });





    /*
     * Script for review/list.blade.php file.
    */

    // Initialize datatable for listing the reviews from db.
    var table = $('#review-dataTable').DataTable({
        processing: true,
        serverSide: true,
        "responsive": true,
        ajax: base_url+'/reviewslist',

        columns: [
            { data: 'id', name: 'id' },
            { data: 'score', searchable: false, orderable: false, render:function(data, type, row){ return '<div class="list-ad-ratings" rating-score="'+data+'"></div>'; } },
            { data: 'product', orderable: false, render:function(data, type, row){ return '<a href="'+site_url+'/ad-details/'+data.id+'" target="_blank">'+data.title+'</a>'; } },
            { data: 'review', name: 'review', orderable: false },
            { data: 'user.username', name: 'user.username', orderable: false },
            { data: 'active', orderable: false, render:function(data, type, row){ if(data == 1) { return '<span class="text-success">Active</span>'; } else { return '<span class="text-warning">Not Active</span>'; } } },

            { data: 'id',searchable: false, orderable: false, render:function(data, type, row){ if(permissions.reviews_management) { if(row.active == 1) { return '<span  class="btn-group" role="group" aria-label="..."> <a href="#" class="btn btn-link btnReviewActive reject" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Reject" style="text-decoration: none;"> <i class="ti-check text-success" style="font-size: 18px;"></i></a>   <a href="'+base_url+'/review/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a> <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger review-del" ><span class="ti-trash"></span></button> </span>'; } else { return '<span  class="btn-group" role="group" aria-label="..."> <a href="#" class="btn btn-link btnReviewActive" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Active" style="text-decoration: none;"> <i class="ti-close text-danger" style="font-size: 18px;"></i></a>   <a href="'+base_url+'/review/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a> <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger review-del" ><span class="ti-trash"></span></button> </span>'; }  } else { return 'No Permission' } } }
        ],
        initComplete: function () {

        },
        createdRow: function (row, data, dataIndex) {
            var ratingScore = $(row).find('.list-ad-ratings').attr('rating-score');
            $(row).find('.list-ad-ratings').css({'color': '#ed9c28', 'margin': 'auto', 'font-size': '14px'});
            $(row).find('.list-ad-ratings').rate({initial_value: ratingScore, readonly: true});

        }
    });

    // Add custom dropdown for user filter and append to datatable.
    $('<div class="pull-left mr-4 d-flex">'+
        '<select class="custom-select" id="custom-user-dropdown">'+
            '<option value="">Filter By Username</option>'+
        '</select>'+
    '</div>').appendTo("#review-dataTable_wrapper .dataTables_filter");

    // Select dropdown value and search from the 3rd column of datatable.
    $('#custom-user-dropdown').on('change', function () {
        table.columns(4).search( this.value ).draw();
    });

    // Loop to add all users in select dropdown from db.
    $('div.username-list > span.username').each(function(index, value) {
        $('#custom-user-dropdown').append('<option value="'+$(this).text()+'">'+$(this).text()+'</option>');
    });

    // Click to ads approve or reject
    $(document).on('click', '.btnReviewActive', function(e) {
        e.preventDefault();
        var id = $(this).attr('data-value');

        if ($(this).hasClass('reject')) {
            var dataC = 'You want to <strong> Deactivate </strong> this review?';
        } else {
            var dataC = 'You want to <strong> Activate </strong> this review?';
        }
        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-warning',
            title: 'Are you sure?',
            content: dataC,
            type: 'orange',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-orange',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/review/'+id+'/status',
                            success: function(data) {
                                if (data.success == false) {
                                    $('#review-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#review-alert-danger').removeClass('d-none');
                                    $("#review-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#review-alert-danger').addClass('d-none');
                                        $("#review-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('body, html').animate({scrollTop:$('body').offset().top}, 'slow');
                                    $('#review-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#review-alert-success').removeClass('d-none');
                                    $("#review-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#review-alert-success').addClass('d-none');
                                        $("#review-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/review');
                                    }, 2000);
                                }
                            },
                            error: function(edata) {
                                if (edata.success == false) {
                                    $('#review-alert-danger').removeClass('d-none');
                                    $('#review-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });

    // click on delete button to delete selected review.
    $(document).on('click', '.review-del', function(e) {
        var id = $(this).attr('data-value');
        var curr = $(this);

        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-times-circle-o red',
            title: 'Are you sure?',
            content: 'You want to delete this review?',
            type: 'red',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-red',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/review/'+id,
                            data: {_method:'DELETE'},
                            success: function(data) {
                                if (data.success == false) {
                                    $('#review-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#review-alert-danger').removeClass('d-none');
                                    $("#review-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#review-alert-danger').addClass('d-none');
                                        $("#review-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#review-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#review-alert-success').removeClass('d-none');
                                    $("#review-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#review-alert-success').addClass('d-none');
                                        $("#review-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/review');
                                    }, 2000);
                                }
                            },
                            error:function(edata) {
                                if (edata.success == false) {
                                    $('#review-alert-danger').removeClass('d-none');
                                    $('#review-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });


    /*
     * Script for review/edit.blade.php file.
    */

    // Initialize rating bar with initial value.
    var list_product_ratings = $('.list-ad-ratings').attr('rating-score');
    $('.list-ad-ratings').rate({initial_value: list_product_ratings, step_size: 1});

    // update input hidden score if user update the score.
    $(".list-ad-ratings").on("change", function(ev, data) {
        $('input[name="score"]').val(data.to);
    });






    /*
     * Script for membership/package/list.blade.php file.
    */

    // Initialize datatable for membership package list from db.
    $('#package-dataTable').DataTable({
        processing: true,
        serverSide: true,
        "responsive": true,
        ajax: base_url+'/packageslist',

        columns: [
            { data: 'id', name: 'id' },
            { data: 'package_name', name: 'package_name', orderable: false },
            { data: 'ad_duration', orderable: false, render: function(data, type, row){ return data+' days'; } },
            { data: 'removable', orderable: false, render: function(data, type, row){ if(data == 1) { return '<h6><span class="badge badge-pill badge-success">Yes</span></h6>'; } else { return '<h6><span class="badge badge-pill badge-warning">No</span></h6>'; } } },

            { data: 'id',searchable: false, orderable: false, render: function(data, type, row){ if(permissions) { if(row.removable == 0) { return '<span class="btn-group" role="group" aria-label="...">  <a href="'+base_url+'/membership-package/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a> </span>'; } else { return '<span  class="btn-group" role="group" aria-label="...">  <a href="'+base_url+'/membership-package/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a> <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger package-del" ><span class="ti-trash"></span></button> </span>'; } } else { return 'No Permission' } } }
        ],
        initComplete: function () {

        }
    });

    // click on delete button to delete selected package.
    $(document).on('click', '.package-del', function(e) {
        var id = $(this).attr('data-value');
        var curr = $(this);

        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-times-circle-o red',
            title: 'Are you sure?',
            content: 'You want to delete this membership package?',
            type: 'red',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-red',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/membership-package/'+id,
                            data: {_method:'DELETE'},
                            success: function(data) {
                                if (data.success == false) {
                                    $('#package-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#package-alert-danger').removeClass('d-none');
                                    $("#package-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#package-alert-danger').addClass('d-none');
                                        $("#package-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#package-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#package-alert-success').removeClass('d-none');
                                    $("#package-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#package-alert-success').addClass('d-none');
                                        $("#package-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/membership-package');
                                    }, 2000);
                                }
                            },
                            error:function(edata) {
                                if (edata.success == false) {
                                    $('#package-alert-danger').removeClass('d-none');
                                    $('#package-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });


    /*
     * Script for membership/package/edit.blade.php file.
    */

    // convert decimal number to fixed floating point e.g; 10 to 10.00
    $('#featured_ad_fee').val(parseFloat($('#featured_ad_fee').val()).toFixed(2));
    $('#urgent_ad_fee').val(parseFloat($('#urgent_ad_fee').val()).toFixed(2));
    $('#highlight_ad_fee').val(parseFloat($('#highlight_ad_fee').val()).toFixed(2));






    /*
     * Script for membership/plan/list.blade.php and edit.blade.php file.
    */

    // Initialize datatable for membership plan list from db.
    $('#plan-dataTable').DataTable({
        processing: true,
        serverSide: true,
        "responsive": true,
        ajax: base_url+'/planslist',

        columns: [
            { data: 'id', name: 'id' },
            { data: 'plan_name', name: 'plan_name', orderable: false },
            { data: 'term', orderable: false, render: function(data, type, row){ return data.toUpperCase(); } },
            { data: 'amount', render: function(data, type, row){ return parseFloat(data).toFixed(2); } },

            { data: 'id',searchable: false, orderable: false, render: function(data, type, row){ if(permissions) { return '<span class="btn-group" role="group" aria-label="...">  <a href="'+base_url+'/membership-plan/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a> </span>'; } else { return 'No Permission' } } }
        ],
        initComplete: function () {

        }
    });

    // convert decimal number to fixed floating point e.g; 10 to 10.00
    $('#plan_amount').val(parseFloat($('#plan_amount').val()).toFixed(2));



    /*
     * Script for membership/upgrade-users.blade.php file.
    */

    // Initialize datatable for upgraded users list from db.
    $('#upgrade-dataTable').DataTable({
        processing: true,
        serverSide: true,
        "responsive": true,
        ajax: base_url+'/upgradeslist',

        columns: [
            { data: 'id', name: 'id' },
            { data: 'username', name: 'username', orderable: false },
            { data: 'plan.plan_name', name: 'plan.plan_name', orderable: false },
            { data: 'plan.term', orderable: false, render: function(data, type, row){ return data.toUpperCase(); } },
            { data: 'subscription_start', orderable: false, render: function(data, type, row){ return data+' / '+row.subscription_end; } },
        ],
        initComplete: function () {

        }
    });



    /*
     * Script for membership/payment-methods/list.blade.php file.
    */

    // Initialize datatable for payment methods list from db.
    $('#payment-dataTable').DataTable({
        processing: true,
        serverSide: true,
        "responsive": true,
        ajax: base_url+'/paymentmethodslist',

        columns: [
            { data: 'id', name: 'id' },
            { data: 'logo', orderable: false, render: function(data, type, row){ return '<img class="img-responsive" width="144px" src="'+data+'" alt="'+row.display_name+'">'; } },
            { data: 'display_name', name: 'display_name', orderable: false },
            { data: 'active', orderable: false, render: function(data, type, row){ if(data == 1) { return '<span class="text-success p-1">Active</span>'; } else { return '<span class="text-danger p-1">Deactive</span>'; } } },
            { data: 'id', orderable: false, render: function(data, type, row){ if(row.active == 1) { return '<span class="btn-group" role="group" aria-label="...">  <a href="#" class="btn btn-link btnPaymentStatus deactive" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Deactivate"> <span class="fa fa-toggle-on"></span></a>  <a href="'+base_url+'/payment-methods/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a> </span>'; } else { return '<span class="btn-group" role="group" aria-label="...">  <a href="#" class="btn btn-link btnPaymentStatus" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Activate"> <span class="fa fa-toggle-off"></span></a>  <a href="'+base_url+'/payment-methods/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a> </span>'; } } }
        ],
        initComplete: function () {

        }
    });

    // Click the btnSliderActive to active or deactive the sliders.
    $(document).on('click', '.btnPaymentStatus', function(e) {
        e.preventDefault();
        var id = $(this).attr('data-value');

        if ($(this).hasClass('deactive')) {
            var dataC = 'You want to <strong> Deactivate </strong> this payment method?';
        } else {
            var dataC = 'You want to <strong> Activate </strong> this payment method?';
        }
        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-warning',
            title: 'Are you sure?',
            content: dataC,
            type: 'orange',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-orange',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/payment-methods/'+id+'/status',
                            success: function(data) {
                                if (data.success == false) {
                                    $('#payment-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#payment-alert-danger').removeClass('d-none');
                                    $("#payment-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#payment-alert-danger').addClass('d-none');
                                        $("#payment-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#payment-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#payment-alert-success').removeClass('d-none');
                                    $("#payment-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#payment-alert-success').addClass('d-none');
                                        $("#payment-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/payment-methods');
                                    }, 2000);
                                }
                            },
                            error: function(edata) {
                                if (edata.success == false) {
                                    $('#payment-alert-danger').removeClass('d-none');
                                    $('#payment-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });







    /*
     * Script for advertising/list.blade.php page.
    */

    // Initialize datatable for listing the advertising.
    $('#advertise-dataTable').DataTable({
        processing: true,
        serverSide: true,
        "responsive": true,
        ajax: base_url+'/advertiselist',

        columns: [
            { data: 'id', name: 'id' },
            { data: 'slug', name: 'slug', orderable: false },
            { data: 'provider_name', name: 'provider_name', orderable: false },
            { data: 'active', orderable: false, render:function(data, type, row){ if(data == 1) { return '<span class="text-success">Activated</span>'; } else { return '<span class="text-warning">Unactivated</span>'; } } },

            { data: 'id',searchable: false, orderable: false, render:function(data, type, row){ if(permissions.advertise_management) { if(row.active == 1) { return '<span  class="btn-group" role="group" aria-label="...">  <a href="#" class="btn btn-link btnAdvertiseActive deactive" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Deactivate"> <span class="fa fa-toggle-on"></span></a> <a href="'+base_url+'/advertising/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a>  <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger advertise-del" ><span class="ti-trash"></span></button> </span>'; } else { return '<span  class="btn-group" role="group" aria-label="...">   <a href="#" class="btn btn-link btnAdvertiseActive" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Activate"> <span class="fa fa-toggle-off"></span></a>  <a href="'+base_url+'/advertising/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a>  <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger advertise-del" ><span class="ti-trash"></span></button> </span>'; } } else { return '<span  class="btn-group" role="group" aria-label="...">  <a href="'+base_url+'/advertising/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a> </span>'; } } }
        ],
        initComplete: function () {

        }
    });

    // Advertisement activate and deactivate on toggle button click
    $(document).on('click', '.btnAdvertiseActive', function(e) {
        e.preventDefault();
        var id = $(this).attr('data-value');
        if ($(this).hasClass('deactive')) {
            var dataC = 'You want to <strong> unactive </strong> this advertisement?';
        } else {
            var dataC = 'You want to <strong> active </strong> this advertisement?';
        }
        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-warning',
            title: 'Are you sure?',
            content: dataC,
            type: 'orange',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-orange',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/advertising/'+id+'/status',
                            success: function(data) {
                                if (data.success == false) {
                                    $('#advertise-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#advertise-alert-danger').removeClass('d-none');
                                    $("#advertise-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#advertise-alert-danger').addClass('d-none');
                                        $("#advertise-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#advertise-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#advertise-alert-success').removeClass('d-none');
                                    $("#advertise-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#advertise-alert-success').addClass('d-none');
                                        $("#advertise-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/advertising');
                                    }, 2000);
                                }
                            },
                            error: function(edata) {
                                if (edata.success == false) {
                                    $('#advertise-alert-danger').removeClass('d-none');
                                    $('#advertise-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });

    // click on delete button to delete selected advertisement.
    $(document).on('click', '.advertise-del', function(e) {
        var id = $(this).attr('data-value');
        var curr = $(this);

        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-times-circle-o red',
            title: 'Are you sure?',
            content: 'You want to delete this advertisement?',
            type: 'red',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-red',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/advertising/'+id,
                            data: {_method:'DELETE'},
                            success: function(data) {
                                if (data.success == false) {
                                    $('#advertise-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#advertise-alert-danger').removeClass('d-none');
                                    $("#advertise-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#advertise-alert-danger').addClass('d-none');
                                        $("#advertise-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#advertise-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#advertise-alert-success').removeClass('d-none');
                                    $("#advertise-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#advertise-alert-success').addClass('d-none');
                                        $("#advertise-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/advertising');
                                    }, 2000);
                                }
                            },
                            error: function(edata) {
                                if (edata.success == false) {
                                    $('#advertise-alert-danger').removeClass('d-none');
                                    $('#advertise-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });









    /*
     * Script for languages/list.blade.php page.
    */

    // Initialize datatable for listing the languages.
    $('#language-dataTable').DataTable({
        processing: true,
        serverSide: true,
        "responsive": true,
        ajax: base_url+'/languageslist',

        columns: [
            { data: 'id', name: 'id' },
            { data: 'locale', name: 'locale', orderable: false },
            { data: 'native', name: 'native', render:function(data, type, row){ if(permissions.language_file) { return data+'<a href="'+base_url+'/languages?file='+row.locale+'" class="btn btn-xs btn-default font-12"> <i class="ti-pencil"></i> Edit '+data+' file</a>'; } else { return data+'<a href="javascript:void(0)" class="btn btn-xs btn-default font-12"> <i class="ti-pencil"></i> Edit '+data+' file</a>'; } } },
            { data: 'direction', name: 'direction', orderable: false },
            { data: 'active', orderable: false, render:function(data, type, row){ if(data == 0){ return '<span class="btn"><i class="fa fa-toggle-off active-lang-btn fa-3x t-red" data-value="'+row.id+'"></i></span>'; }else{ return '<span class="btn"><i class="fa fa-toggle-on active-lang-btn fa-3x t-green" data-value="'+row.id+'"></i></span>'; } } },

            { data: 'id', orderable: false, render: function(data, type, row){ if(permissions.language_management) { return '<span class="btn-group" role="group" aria-label="...">   <a href="'+base_url+'/languages/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a>  <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger language-del" ><span class="ti-trash"></span></button>  </span>'; } else { return 'No Permission'; } } }
        ],
        initComplete: function () {

        }
    });

    // Click to change the status of language
    $(document).on('click', '.active-lang-btn', function(e) {
        var id = $(this).attr('data-value');

        if ($(this).hasClass('fa-toggle-on')) {
            $(this).removeClass('fa-toggle-on');
            $(this).addClass('fa-toggle-off');
            $(this).removeClass('t-green');
            $(this).addClass('t-red');
        } else {
            $(this).removeClass('fa-toggle-off');
            $(this).addClass('fa-toggle-on');
            $(this).removeClass('t-red');
            $(this).addClass('t-green');
        }

        $.ajax({
            type: 'POST',
            url: base_url+'/languages/'+id+'/status',
            success: function(data) {
                if (data.success == false) {
                    $('#language-alert-danger').html('<strong>'+data.message+'</strong>');
                    $('#language-alert-danger').removeClass('d-none');
                    $("#language-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                        $('#language-alert-danger').addClass('d-none');
                        $("#language-alert-danger").slideUp(500);
                    });
                } else if (data.success == true) {
                    $('#language-alert-success').html('<strong>'+data.message+'</strong>');
                    $('#language-alert-success').removeClass('d-none');
                    $("#language-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                        $('#language-alert-success').addClass('d-none');
                        $("#language-alert-success").slideUp(500);
                    });
                }
            },
            error: function(edata) {
                if (edata.success == false) {
                    $('#language-alert-danger').removeClass('d-none');
                    $('#language-alert-danger').html(edata.errors);
                }
            }
        });
    });

    // click on delete button to delete selected advertisement.
    $(document).on('click', '.language-del', function(e) {
        var id = $(this).attr('data-value');
        var curr = $(this);

        $.confirm({
            theme: 'modern', // 'material', 'bootstrap'
            closeIcon: true,
            typeAnimated: true,
            icon: 'fa fa-times-circle-o red',
            title: 'Are you sure?',
            content: 'You want to delete this language?',
            type: 'red',
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-red',
                    action: function() {
                        $.ajax({
                            type: 'POST',
                            url: base_url+'/languages/'+id,
                            data: {_method:'DELETE'},
                            success: function(data) {
                                if (data.success == false) {
                                    $('#language-alert-danger').html('<strong>'+data.message+'</strong>');
                                    $('#language-alert-danger').removeClass('d-none');
                                    $("#language-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#language-alert-danger').addClass('d-none');
                                        $("#language-alert-danger").slideUp(500);
                                    });
                                } else if (data.success == true) {
                                    $('#language-alert-success').html('<strong>'+data.message+'</strong>');
                                    $('#language-alert-success').removeClass('d-none');
                                    $("#language-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                        $('#language-alert-success').addClass('d-none');
                                        $("#language-alert-success").slideUp(500);
                                    });
                                    setTimeout(function() {
                                        window.location.replace(base_url+'/languages');
                                    }, 2000);
                                }
                            },
                            error: function(edata) {
                                if (edata.success == false) {
                                    $('#language-alert-danger').removeClass('d-none');
                                    $('#language-alert-danger').html(edata.errors);
                                }
                            }
                        });
                    }
                },
                no: function () {
                    text: 'No'
                }
            }
        });
    });




});

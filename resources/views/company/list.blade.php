@extends('layouts.app')

@section('header_after_scripts')
<link rel="stylesheet" type="text/css" href="{{ URL::asset('assets/lib/dataTables/css/jquery.dataTables.css') }}">
<link rel="stylesheet" type="text/css" href="{{ URL::asset('assets/lib/dataTables/css/dataTables.bootstrap4.min.css') }}">
<link rel="stylesheet" type="text/css" href="{{ URL::asset('assets/lib/dataTables/css/responsive.bootstrap.min.css') }}">
<link rel="stylesheet" type="text/css" href="{{ URL::asset('assets/lib/dataTables/css/responsive.jqueryui.min.css') }}">
@endsection

@section('breadcrumb')
<div class="col-sm-6">
    <div class="breadcrumbs-area clearfix">
        <h4 class="page-title pull-left">{{__('Companies')}}</h4>
        <ul class="breadcrumbs pull-left">
            <li><a href="{{ url('dashboard') }}">{{__('Home')}}</a></li>
            <li><span>{{__('Lists')}}</span></li>
        </ul>
    </div>
</div>
@endsection

@section('content')
<div class="main-content-inner">
    <div class="row">
        <!-- company datatable start -->
        <div class="col-12 mt-5">
            <div class="card">
                <div class="card-body">

                    <div class="alert-dismiss">
                        <div id="company-alert-danger" class="alert alert-danger alert-dismissible fade show d-none" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span class="fa fa-times"></span></button>
                        </div>
                        <div id="company-alert-success" class="alert alert-success alert-dismissible fade show d-none" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span class="fa fa-times"></span></button>
                        </div>
                        @if (session('success'))
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                <strong>{{__('Success')}}!</strong> {{ session('success') }}.
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span class="fa fa-times"></span></button>
                            </div>
                        @endif
                    </div>

                    <a href="{{ route('company.create') }}" class="btn btn-primary pull-right mb-md-2">{{__('Add Company')}}</a>

                    <h4 class="header-title">{{__('All Companies')}}</h4>
                    <div class="data-tables datatable-dark">
                        <table id="company-dataTable" class="table text-center" style="width:100%">
                            <thead class="text-capitalize">
                                <tr>
                                    <th>{{__('ID')}}</th>
                                    <th>{{__('Name')}}</th>
                                    <th>{{__('Email')}}</th>
                                    <th>{{__('Logo')}}</th>
                                    <th>{{__('Website')}}</th>
                                    <th>{{__('Action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <!-- company datatable end -->
    </div>
</div>
@endsection

@section('footer_after_scripts')
<script type="text/javascript">
    $(document).ready(function() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $('.manage-companies').addClass('active');

        // Initialize datatable for listing the company.
        $('#company-dataTable').DataTable({
            processing: true,
            serverSide: true,
            "responsive": true,
            ajax: base_url+'/companieslist',

            columns: [
                { data: 'id', name: 'id' },
                { data: 'name', name: 'name', orderable: false },
                { data: 'email', name: 'email', orderable: false },
                { data: 'logo', name: 'logo', orderable: false, render: function(data, type, row) {
                    if (data) {
                        return '<img src="{{asset('storage/images')}}/'+data+'" width="50px" class="rounded-circle" alt="'+data+'">';
                    } else {
                        return '';
                    }
                } },
                { data: 'website', name: 'website', orderable: false },
                { data: 'id', searchable: false, orderable: false, render: function(data, type, row) { 
                    return '<span  class="btn-group" role="group" aria-label="...">  <a href="'+base_url+'/company/'+data+'/edit" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Edit"><span class="ti-pencil-alt"></span></a> <button type="button" data-value="'+data+'" data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-danger company-del" ><span class="ti-trash"></span></button> </span>'; 
                } }
            ],
            initComplete: function () {
            }
        });

        // click on delete button to delete selected company.
        $(document).on('click', '.company-del', function(e) {
            var id = $(this).attr('data-value');
            var curr = $(this);

            $.confirm({
                theme: 'modern', // 'material', 'bootstrap'
                closeIcon: true,
                typeAnimated: true,
                icon: 'fa fa-times-circle-o red',
                title: 'Are you sure?',
                content: 'You want to delete this company?',
                type: 'red',
                buttons: {
                    yes: {
                        text: 'Yes',
                        btnClass: 'btn-red',
                        action: function() {
                            $.ajax({
                                type: 'POST',
                                url: base_url+'/company/'+id,
                                data: { _method:'DELETE' },
                                success: function(data) {
                                    if (data.success == false) {
                                        $('#company-alert-danger').html('<strong>'+data.message+'</strong>');
                                        $('#company-alert-danger').removeClass('d-none');
                                        $("#company-alert-danger").fadeTo(2000, 500).slideUp(600, function() {
                                            $('#company-alert-danger').addClass('d-none');
                                            $("#company-alert-danger").slideUp(500);
                                        });
                                    } else if (data.success == true) {
                                        $('#company-alert-success').html('<strong>'+data.message+'</strong>');
                                        $('#company-alert-success').removeClass('d-none');
                                        $("#company-alert-success").fadeTo(2000, 500).slideUp(600, function() {
                                            $('#company-alert-success').addClass('d-none');
                                            $("#company-alert-success").slideUp(500);
                                        });
                                        setTimeout(function() {
                                            window.location.replace(base_url+'/company');
                                        }, 2000);

                                    }
                                },
                                error: function(edata) {
                                    if (edata.success == false) {
                                        $('#company-alert-danger').removeClass('d-none');
                                        $('#company-alert-danger').html(edata.errors);
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
</script>
@endsection

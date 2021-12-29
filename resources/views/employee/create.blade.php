@extends('layouts.app')

@section('header_after_scripts')
<link rel="stylesheet" href="{{ URL::asset('assets/lib/select2-4.0.5/select2.min.css') }}">
<link rel="stylesheet" href="{{ URL::asset('assets/lib/icheck-1.0.2/skins/all.css') }}">
@endsection

@section('breadcrumb')
<div class="col-sm-6">
    <div class="breadcrumbs-area clearfix">
        <h4 class="page-title pull-left">{{__('Employees')}}</h4>
        <ul class="breadcrumbs pull-left">
            <li><a href="{{ url('dashboard') }}">{{__('Home')}}</a></li>
            <li><a href="{{ url('dashboard/employee') }}">{{__('Lists')}}</a></li>
            <li><span>{{__('Create')}}</span></li>
        </ul>
    </div>
</div>
@endsection

@section('content')
<div class="main-content-inner">
    <div class="row">
        <div class="col-12">
            <div class="card mt-5">

                @if ($errors->any())
                    <div class="alert alert-danger">
                        <ul>
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <!-- create employee form start here  -->
                <div class="card-body">
                    <h4 class="header-title mb-4">{{__('Add Employee')}}</h4>
                    <form class="needs-validation" novalidate="" method="post" action="{{ route('employee.store') }}" enctype="multipart/form-data">
                        @csrf
                        <div class="form-row">
                            <div class="col-md-6 mb-3">
                                <label for="first_name" class="required">{{__('First Name')}}</label>
                                <input type="text" class="form-control" id="first_name" name="first_name" placeholder="First Name" required="" value="{{ old('first_name') }}">
                                <div class="invalid-feedback">
                                    First Name is required.
                                </div>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label for="last_name" class="required">{{__('Last Name')}}</label>
                                <input type="text" class="form-control" id="last_name" name="last_name" placeholder="Last Name" required="" value="{{ old('last_name') }}">
                                <div class="invalid-feedback">
                                    Last Name is required.
                                </div>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label for="company_id" class="required">{{__('Company')}}</label>
                                <select class="custom-select form-control select2" name="company_id" id="company_id" style="width: 100%;">
                                    <option value="" selected disabled>{{__('Select Company')}}</option>
                                    @if(isset($companies))
                                        @foreach($companies as $company)
                                            <option value="{{$company->id}}" @if(old('company_id') == $company->id) selected @endif>{{ $company->name }}</option>
                                        @endforeach
                                    @endif
                                </select>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label for="email">{{__('Email')}}</label>
                                <input type="email" class="form-control" id="email" name="email" placeholder="Email" value="{{ old('email') }}">
                            </div>

                            <div class="col-md-6 mb-3">
                                <label for="phone">{{__('Phone')}}</label>
                                <input type="text" class="form-control" name="phone" id="phone" placeholder="Phone" value="{{ old('phone') }}">
                            </div>
                        </div>

                        <div class="form-group"></div>
                        <button class="btn btn-primary save" type="submit">{{__('Submit')}}</button>
                    </form>
                </div>
                <!-- create employee form end here  -->
            </div>
        </div>
    </div>
</div>
@endsection

@section('footer_after_scripts')
<script type="text/javascript">
    $(document).ready(function() {
        $('.manage-employees').addClass('active');

        // Initialize select2 for dropdown
        $('.select2').select2();
    });
</script>
@endsection

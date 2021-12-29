@extends('layouts.app')

@section('header_after_scripts')
<link rel="stylesheet" href="{{ URL::asset('assets/lib/select2-4.0.5/select2.min.css') }}">
<link rel="stylesheet" href="{{ URL::asset('assets/lib/icheck-1.0.2/skins/all.css') }}">
@endsection

@section('breadcrumb')
<div class="col-sm-6">
    <div class="breadcrumbs-area clearfix">
        <h4 class="page-title pull-left">{{__('Companies')}}</h4>
        <ul class="breadcrumbs pull-left">
            <li><a href="{{ url('dashboard') }}">{{__('Home')}}</a></li>
            <li><a href="{{ url('dashboard/company') }}">{{__('Lists')}}</a></li>
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

                <!-- create company form start here  -->
                <div class="card-body">
                    <h4 class="header-title mb-4">{{__('Add Company')}}</h4>
                    <form class="needs-validation" novalidate="" method="post" action="{{ route('company.store') }}" enctype="multipart/form-data">
                        @csrf
                        <div class="form-row">
                            <div class="col-md-6 mb-3">
                                <label for="name" class="required">{{__('Name')}}</label>
                                <input type="text" class="form-control" id="name" name="name" placeholder="Name" required="" value="{{ old('name') }}">
                                <div class="invalid-feedback">
                                    Name is required.
                                </div>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label for="email">{{__('Email')}}</label>
                                <input type="email" class="form-control" id="email" name="email" placeholder="Email" value="{{ old('email') }}">
                            </div>

                            <div class="col-md-6 mb-3">
                                <label for="website">{{__('Website')}}</label>
                                <input type="text" class="form-control" name="website" id="website" placeholder="Enter website" value="{{ old('website') }}">
                            </div>

                            <div class="col-md-6 mb-3">
                                <label for="logo">{{__('Logo')}} <small>(Minimum dimension 100x100)</small> </label>
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">{{__('Upload')}}</span>
                                    </div>
                                    <div class="custom-file">
                                        <input type="file" class="custom-file-input" id="logo" name="logo" accept="image/png, image/jpeg, image/jpg">
                                        <label class="custom-file-label" id="picLabel" for="logo">{{__('Choose image')}}</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group"></div>
                        <button class="btn btn-primary save" type="submit">{{__('Submit')}}</button>
                    </form>
                </div>
                <!-- create company form end here  -->
            </div>
        </div>
    </div>
</div>
@endsection

@section('footer_after_scripts')
<script type="text/javascript">
    $(document).ready(function() {
        $('.manage-companies').addClass('active');

        // choose picture and preview in the img tag and set the name in the picture label before updating.
        $('#logo').on('change', function() {
            var input = this;
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function(e) {
                    // $('#preview_image').prop('src', e.target.result);
                    $('#picLabel').text(input.files[0].name);
                }
                reader.readAsDataURL(input.files[0]);
            }
        });
    });
</script>
@endsection

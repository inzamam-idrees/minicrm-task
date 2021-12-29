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
            <li><span>{{__('Edit')}}</span></li>
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

                <!-- update company form start here  -->
                <div class="card-body">
                    <h4 class="header-title mb-4">{{__('Edit Company')}}</h4>
                    <form class="needs-validation" novalidate="" method="POST" action="{{ url('dashboard/company/'.$company->id) }}" enctype="multipart/form-data">
                        @csrf
                        @method('PUT')
                        <div class="form-row">
                            <div class="col-md-12 mb-5">
                                <div class="mx-auto d-block text-center">
                                    @if($company->logo != null)
                                        <img src="{{asset('storage/images')}}/{{$company->logo}}" id="preview_image" class="rounded-circle" alt="{{$company->name}}">
                                    @else
                                        <img src="{{asset('storage/images')}}/avatar.png" id="preview_image" class="rounded-circle" alt="avatar">
                                    @endif
                                    <div class="clearfix"></div>
                                    <label for="logo">{{__('Logo')}} <small>(Minimum dimension 100x100)</small></label>
                                </div>
                                <div class="input-group mx-auto" style="width: 50%">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">{{__('Upload')}}</span>
                                    </div>
                                    <div class="custom-file">
                                        <input type="file" class="custom-file-input" id="logo" name="logo">
                                        <label class="custom-file-label" id="picLabel" for="logo">{{__('Choose image')}}</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="col-md-6 mb-3">
                                <label for="name" class="required">{{__('Name')}}</label>
                                <input type="text" class="form-control" id="name" name="name" placeholder="Name" required="" value="{{ old('name', isset($company->name) ? $company->name : '') }}">
                                <div class="invalid-feedback">
                                    Name is required.
                                </div>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label for="email">{{__('Email')}}</label>
                                <input type="email" class="form-control" id="email" name="email" placeholder="Email" value="{{ old('email', isset($company->email) ? $company->email : '') }}">
                            </div>

                            <div class="col-md-6 mb-3">
                                <label for="website">{{__('Website')}}</label>
                                <input type="text" class="form-control" name="website" id="website" placeholder="Enter website" value="{{ old('website', isset($company->website) ? $company->website : '') }}">
                            </div>
                        </div>

                        <div class="form-group"></div>
                        <button class="btn btn-primary save" type="submit">{{__('Update')}}</button>
                    </form>
                </div>
                <!-- update company form end here  -->
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
                    $('#preview_image').prop('src', e.target.result);
                    $('#picLabel').text(input.files[0].name);
                }
                reader.readAsDataURL(input.files[0]);
            }
        });
    });
</script>
@endsection

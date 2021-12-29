@extends('layouts.app')

@section('header_after_scripts')

@endsection

@section('breadcrumb')
<div class="col-sm-6">
    <div class="breadcrumbs-area clearfix">
        <h4 class="page-title pull-left">{{__('Dashboard')}}</h4>
        <ul class="breadcrumbs pull-left">
            <li><a href="{{ url('dashboard') }}">{{__('Home')}}</a></li>
            <li><span>{{__('Dashboard')}}</span></li>
        </ul>
    </div>
</div>
@endsection

@section('content')
    <div class="main-content-inner">
        <!-- cards area start -->
        <div class="sales-report-area sales-style-two">
            <div class="row dashboard-count">
                <div class="col-xl-3 col-ml-3 col-md-6 mt-3">
                    <a class="card bg-blue bg-inverse" href="{{ url('dashboard/company') }}">
                        <div class="card-block clearfix">
                            <div class="pull-right">
                                <p class="h6 text-muted mt-0 mb-1">{{__('Company')}}</p>
                                <p class="h3 text-primary mt-2 mb-0">1</p>
                            </div>
                            <div class="mr-5">
                                <span class="img-avatar img-avatar-48 bg-blue bg-inverse"><i class="fa fa-building fa-1-5x"></i></span>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="col-xl-3 col-ml-3 col-md-6 mt-3">
                    <a class="card bg-green bg-inverse" href="{{ url('dashboard/employee') }}">
                        <div class="card-block clearfix">
                            <div class="pull-right">
                                <p class="h6 text-muted mt-0 mb-1">{{__('Employee')}}</p>
                                <p class="h3 text-primary mt-2 mb-0">2</p>
                            </div>
                            <div class="mr-5">
                                <span class="img-avatar img-avatar-48 bg-gray-light-o"><i class="fa fa-user fa-1-5x"></i></span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <!-- cards area end -->
    </div>
@endsection

@section('footer_after_scripts')
<script type="text/javascript">
    $(document).ready(function() {
        $('.dashboard').addClass('active');
    });
</script>
@endsection

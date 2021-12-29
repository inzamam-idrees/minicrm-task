<!doctype html>
<html class="no-js" lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>{{'Mini CRM - Dashboard'}}</title>

    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @yield('header_before_scripts')

    <link rel="stylesheet" href="{{ URL::asset('assets/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ URL::asset('assets/css/font-awesome.min.css') }}">
    <link rel="stylesheet" href="{{ URL::asset('assets/css/themify-icons.css') }}">
    <link rel="stylesheet" href="{{ URL::asset('assets/css/metisMenu.css') }}">
    <link rel="stylesheet" href="{{ URL::asset('assets/css/owl.carousel.min.css') }}">
    <link rel="stylesheet" href="{{ URL::asset('assets/css/slicknav.min.css') }}">

    <!-- library css -->
    <link rel="stylesheet" href="{{ URL::asset('assets/lib/jquery-confirm-3.3.0/jquery-confirm.min.css') }}">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.4.0/css/bootstrap4-toggle.min.css">

    @yield('header_after_scripts')

    <!-- others css -->
    <link rel="stylesheet" href="{{ URL::asset('assets/css/typography.css') }}">
    <link rel="stylesheet" href="{{ URL::asset('assets/css/default-css.css') }}">
    <link rel="stylesheet" href="{{ URL::asset('assets/css/styles.css') }}">
    <link rel="stylesheet" href="{{ URL::asset('assets/css/responsive.css') }}">

    <!-- custom css -->
    <link rel="stylesheet" href="{{ URL::asset('assets/css/custom.css') }}">

    <!-- modernizr css -->
    <script src="{{ URL::asset('assets/js/vendor/modernizr-2.8.3.min.js') }}"></script>

    <script type="text/javascript">
        var site_url = '{{ url('/') }}';
        var base_url = '{{ url('dashboard') }}';
	</script>
</head>

<body>
    <!-- preloader area start -->
    <div id="preloader">
        <div class="loader"></div>
    </div>
    <!-- preloader area end -->

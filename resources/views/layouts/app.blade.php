@include('layouts.header')

<!-- page container area start -->
<div class="page-container">
    <!-- sidebar menu area start -->
    <div class="sidebar-menu">
        <div class="sidebar-header">
            <div class="logo">
                <a href="{{ url('dashboard') }}" style="color:#fff; font-size: 25px;">{{__('Mini CRM')}}</a>
            </div>
        </div>
        <div class="main-menu">
            <div class="menu-inner">
                <nav>
                    <ul class="metismenu" id="menu">
                        <li class="dashboard">
                            <a href="{{ url('dashboard') }}" aria-expanded="true"><i class="ti-dashboard"></i><span>{{ __('Dashboard')}}</span></a>
                        </li>
                        <li class="manage-companies">
                            <a href="{{ url('dashboard/company') }}" aria-expanded="true"><i class="fa fa-building"></i><span>{{__('Company')}}</span></a>
                        </li>
                        <li class="manage-employees">
                            <a href="{{ url('dashboard/employee') }}" aria-expanded="true"><i class="ti-user"></i><span>{{__('Employee')}}</span></a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
    <!-- sidebar menu area end -->

    <!-- main content area start -->
        <div class="main-content">
            <!-- header area start -->
            <div class="header-area">
                <div class="row align-items-center">
                    <!-- nav and search button -->
                    <div class="col-md-6 col-sm-8 clearfix">
                        <div class="nav-btn pull-left">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- header area end -->

            <!-- page title area start -->
            <div class="page-title-area">
                <div class="row align-items-center">

                    @yield('breadcrumb')

                    <div class="col-sm-6 clearfix">
                        <div class="user-profile pull-right">
                            <img class="avatar user-thumb" src="{{ URL::asset('assets/images/author/avatar.png') }}" alt="avatar">
                            <h4 class="user-name dropdown-toggle" data-toggle="dropdown">{{ isset(Auth::user()->name) ? Auth::user()->name : Auth::user()->email }} <i class="fa fa-angle-down"></i></h4>
                            <div class="dropdown-menu">
                                <form action="{{ route('logout') }}" method="post">
                                    @csrf
                                    <a class="dropdown-item" href="{{ route('logout') }}" onclick="event.preventDefault(); this.closest('form').submit();">{{__('Log Out')}}</a>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- page title area end -->

            <!-- main content inner area start -->
            @yield('content')
            <!-- main content inner area end -->

        </div>
        <!-- main content area end -->
@include('layouts.footer')

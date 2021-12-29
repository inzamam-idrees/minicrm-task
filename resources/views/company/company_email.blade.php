<!DOCTYPE html>
<html>
<head>
    <title>Mini CRM Task - Code Informatics</title>
</head>
<body>

    <h4>Thanks for register a new company in our panel.</h4>

    <p>Here is the details: </p>
    <span>Company Name: <b>{{ $data['name'] }}</b></span> <br>
    <span>Company Email: <b>{{ $data['email'] }}</b></span> <br>
    <span>Company Website: <b>{{ $data['website'] }}</b></span> <br>

    <p>You can check your registered company by clicking here after the login 
        <a href="{{ url('/dashboard/company') }}/{{$data['id']}}/edit" target="_blank">Click Here</a>
    </p>

    <p>Regards,</p>
</body>
</html>
<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;
use App\Models\Company;
use App\Models\Employee;
use Validator;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('employee.list');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $companies = Company::get();
        return view('employee.create', compact('companies'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $rules = array(
            'first_name' => 'required|string|max:191',
            'last_name' => 'required|string|max:191',
            'company_id' => 'required',
        );

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return redirect()->back()->withInput()->with('errors', $validator->errors());
        } else {
            $employee = new Employee();
            $employee->first_name = $request->get('first_name');
            $employee->last_name = $request->get('last_name');
            $employee->company_id = $request->get('company_id');
            $employee->email = $request->get('email');
            $employee->phone = $request->get('phone');
            $employee->save();

            return redirect('dashboard/employee')->with('success', 'Employee added successfully!');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $companies = Company::get();
        $employee = Employee::find($id);
        return view('employee.edit', compact('employee', 'companies'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $rules = array(
            'first_name' => 'required|string|max:191',
            'last_name' => 'required|string|max:191',
            'company_id' => 'required',
        );

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return redirect()->back()->withInput()->with('errors', $validator->errors());
        } else {
            $employee = Employee::find($id);
            $employee->first_name = $request->get('first_name');
            $employee->last_name = $request->get('last_name');
            $employee->company_id = $request->get('company_id');
            $employee->email = $request->get('email');
            $employee->phone = $request->get('phone');
            $employee->save();

            return redirect('dashboard/employee')->with('success', 'Employee updated successfully!');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $employee = Employee::find($id);
        if ($employee OR !empty($employee)) {
            $employee->delete();
            return response()->json(['success' => true, 'message' => 'Employee deleted successfully!']);
        } else {
            return response()->json(['success' => false, 'message' => 'Failed to delete. Please Try again!']);
        }
    }

    /**
     * Display a listing of the employee in the form of datatables.
     *
     * @return \Illuminate\Http\Response
     */
    public function employeesList()
    {
        $employee = Employee::with('company')->get();
        return Datatables::of($employee)->make(true);
    }
}

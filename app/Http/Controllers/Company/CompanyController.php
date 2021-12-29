<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;
use App\Models\Company;
use Validator;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('company.list');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('company.create');
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
            'name' => 'required|string|max:191',
            'logo' => 'image|mimes:jpg,png,jpeg|max:4096|dimensions:min_width=100,min_height=100"',
        );

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return redirect()->back()->withInput()->with('errors', $validator->errors());
        } else {
            $company = new Company();

            if ($request->file('logo')) {

                if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
                    $path = $request->logo->store('public/images/');
                    $path = basename($path);

                    $company->logo = $path;
                    $company->name = $request->get('name');
                    $company->email = $request->get('email');
                    $company->website = $request->get('website');
                    $company->save();
                } else {
                    return redirect()->back()->with('errors', 'Invalid Image file found!');
                }
            } else {
                $company->name = $request->get('name');
                $company->email = $request->get('email');
                $company->website = $request->get('website');
                $company->save();
            }

            $sent_email = ($company->email && $company->email != "") ? $company->email : "admin@admin.com";
            $data = [
                "id" => $company->id,
                "name" => $company->name,
                "email" => $company->email,
                "website" => $company->website
            ];

            \Mail::to($sent_email)->send(new \App\Mail\WelcomeCompany($data));

            return redirect('dashboard/company')->with('success', 'Company added successfully!');
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
        $company = Company::find($id);
        return view('company.edit', compact('company'));
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
            'name' => 'required|string|max:191',
            'logo' => 'image|mimes:jpg,png,jpeg|max:4096|dimensions:min_width=100,min_height=100"',
        );

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return redirect()->back()->withInput()->with('errors', $validator->errors());
        } else {
            $company = Company::find($id);

            if ($request->file('logo')) {

                if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
                    // Remove old picture
                    if($company->logo !== null AND file_exists(storage_path('app\public\images').'/'.$company->logo)) {
                        unlink(storage_path('app\public\images').'/'.$company->logo);
                    }

                    $path = $request->logo->store('public/images/');
                    $path = basename($path);

                    $company->logo = $path;
                    $company->name = $request->get('name');
                    $company->email = $request->get('email');
                    $company->website = $request->get('website');
                    $company->save();
                } else {
                    return redirect()->back()->with('errors', 'Invalid Image file found!');
                }
            } else {
                $company->name = $request->get('name');
                $company->email = $request->get('email');
                $company->website = $request->get('website');
                $company->save();
            }

            return redirect('dashboard/company')->with('success', 'Company updated successfully!');
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
        $company = Company::find($id);
        if ($company OR !empty($company)) {
            if($company->logo !== null AND file_exists(storage_path('app\public\images').'/'.$company->logo)) {
                unlink(storage_path('app\public\images').'/'.$company->logo);
            }
            $company->delete();
            return response()->json(['success' => true, 'message' => 'Company deleted successfully!']);
        } else {
            return response()->json(['success' => false, 'message' => 'Failed to delete. Please Try again!']);
        }
    }

    /**
     * Display a listing of the company in the form of datatables.
     *
     * @return \Illuminate\Http\Response
     */
    public function companiesList()
    {
        $company = Company::get();
        return Datatables::of($company)->make(true);
    }
}

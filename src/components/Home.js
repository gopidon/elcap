import React, {Component} from 'react';
import { Alert, Tabs, Divider, Icon, Button, Steps, message, Layout, Input, Badge} from 'antd';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {formatDate} from '../utils/date';
import Environment from '../utils/env'
const { Table, Column, Cell } = require('fixed-data-table-2');
const TabPane = Tabs.TabPane;
const {Sider, Content} = Layout;
const Step = Steps.Step
import Loading from './widgets/Loading';

export default class NewsList extends Component
{


    state = {
        uploadingApis: false,
        uploadingFormC: false,
        processing: false,
        apisFile: null,
        formCFile: null,
        matchedData: [],
        filteredMatchedData: [],
        unmatchedData: [],
        filteredUnmatchedData: [],
        current: 0
    }

    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    render(){
        const {apisFile, formCFile, matchedData, uploadingApis, uploadingFormC, filteredMatchedData, unmatchedData, filteredUnmatchedData, processing, current} = this.state;
        console.log("matched Data:", matchedData);
        //console.log(Object.keys(unmatchedData[0]))
        return (
            <Layout>
                <Content style={{ padding: '24px 0', background: '#fff'}}>
                    <Steps current={current}>
                        <Step key={1} title="Upload Duty Free Data (Form C)" />
                        <Step key={2} title="Upload Flights Data (APIS)" />
                        <Step key={3} title="Process Data" />
                    </Steps>
                    <div className="steps-content">
                        {
                            current == 0
                            &&
                            <div>
                                <h3>Upload FormC file</h3>
                                <Divider/>
                                <form encType="multipart/form-data" method="POST">
                                    <input id="fileFormC" type="file" />
                                    <Button type="primary" loading={this.state.uploadingFormC} onClick={this._uploadFormCFile.bind(this)}>
                                        <Icon type="upload" /> Upload
                                    </Button>
                                </form>
                            </div>

                        }
                        {
                            current==1
                            &&
                            <div>
                                <h3>Upload APIS file</h3>
                                <Divider/>
                                <form encType="multipart/form-data" method="POST">
                                    <input id="fileApis" type="file" />
                                    <Button type="primary" loading={this.state.uploadingApis} onClick={this._uploadApisFile.bind(this)}>
                                        <Icon type="upload" /> Upload
                                    </Button>
                                </form>
                            </div>
                        }
                        {
                            current==2
                            &&
                            <div>
                                <div style={{marginTop: 25}}>
                                    <h3>Uploaded Files:</h3>
                                    <Divider/>
                                    {
                                        formCFile && !uploadingApis?
                                            <div>
                                                <a target="_blank" style={{marginLeft: 5}} href={formCFile}>FormC File</a>
                                            </div>:
                                            <div>
                                                <Icon type="loading"/>
                                            </div>
                                    }
                                    {
                                        apisFile && !uploadingFormC?
                                            <div>
                                                <a style={{marginLeft: 5}} target="_blank" href={apisFile}>APIS File</a>
                                            </div>:
                                            <div>
                                                <Icon type="loading"/>
                                            </div>

                                    }
                                </div>

                            </div>
                        }
                    </div>
                    <div className="steps-action">
                        {
                            this.state.current < 2
                            &&
                            <Button type="primary" onClick={() => this.next()}>Next</Button>
                        }
                        {
                            this.state.current === 2
                            &&
                            <Button type="primary" loading={this.state.processing} onClick={this._process.bind(this)} disabled={uploadingApis || uploadingFormC || !(apisFile && formCFile)}>
                                <Icon type="sync"/> Process the files!
                            </Button>
                        }
                        {
                            this.state.current > 0
                            &&
                            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                Previous
                            </Button>
                        }
                    </div>
                    <div style={{marginTop: 25}}>
                        {
                            processing?<Alert message="Processing takes time based on the size of flights Data. Please wait ..." type="info" />:<div/>
                        }
                    </div>
                    <Tabs style={{marginTop: 25}} type="card">
                        <TabPane tab="Unmatched Data" key="1">
                            <div>
                                {
                                    filteredUnmatchedData.length>0?
                                        <div style={{margin: 25}}>
                                            <div style={{marginBottom: 15}}>
                                                <a style={{marginLeft: 5}} target="_blank" href={'http://35.197.159.241:5000/data/unmatched.xlsx'}>Download in excel format</a>
                                            </div>
                                            <Input.Search
                                                placeholder="Filter by Customer Name"
                                                onSearch={this._filterUnmatched.bind(this,'Customer Name')}
                                                style={{ width: 200 }}
                                            />
                                            <span style={{display: 'inline-block',width: 100}}/>
                                            <Input.Search
                                                placeholder="Filter by Passport"
                                                onSearch={this._filterUnmatched.bind(this, 'Passport No.')}
                                                style={{ width: 200 }}
                                            />
                                            <Input.Search
                                                placeholder="Filter by Item"
                                                onSearch={this._filterUnmatched.bind(this, 'Item Description')}
                                                style={{ width: 300 }}
                                            />
                                            <Table
                                                rowHeight={50}
                                                rowsCount={filteredUnmatchedData.length}
                                                width={1100}
                                                height={500}
                                                headerHeight={50}
                                                data={filteredUnmatchedData}
                                            >
                                                <Column
                                                    header={<Cell>Customer Name</Cell>}
                                                    columnKey="Customer Name"
                                                    cell={({ rowIndex, columnKey, ...props }) =>
                                                        <Cell {...props}>
                                                            {filteredUnmatchedData[rowIndex][columnKey]}
                                                        </Cell>}
                                                    fixed={true}
                                                    width={200}
                                                />
                                                <Column
                                                    header={<Cell>Flight No</Cell>}
                                                    columnKey="Flight"
                                                    cell={({ rowIndex, columnKey, ...props }) =>
                                                        <Cell {...props}>
                                                            {filteredUnmatchedData[rowIndex][columnKey]}
                                                        </Cell>}
                                                    fixed={true}
                                                    width={100}
                                                />
                                                <Column
                                                    header={<Cell>Passport</Cell>}
                                                    columnKey="Passport No."
                                                    cell={({ rowIndex, columnKey, ...props }) =>
                                                        <Cell {...props}>
                                                            {filteredUnmatchedData[rowIndex][columnKey]}
                                                        </Cell>}
                                                    fixed={true}
                                                    width={200}
                                                />
                                                <Column
                                                    header={<Cell>Item Desc</Cell>}
                                                    columnKey="Item Description"
                                                    cell={({ rowIndex, columnKey, ...props }) =>
                                                        {
                                                            return <Cell {...props}>
                                                                {filteredUnmatchedData[rowIndex][columnKey]}
                                                            </Cell>
                                                        }
                                                    }
                                                    fixed={true}
                                                    width={300}
                                                />
                                                <Column
                                                    header={<Cell>Quantity</Cell>}
                                                    columnKey="Quantity"
                                                    cell={({ rowIndex, columnKey, ...props }) =>
                                                        <Cell {...props}>
                                                            {filteredUnmatchedData[rowIndex][columnKey]}
                                                        </Cell>}
                                                    fixed={true}
                                                    width={100}
                                                />
                                                {/*<Column
                                                    header={<Cell>Name</Cell>}
                                                    columnKey="Name"
                                                    cell={({ rowIndex, columnKey, ...props }) =>
                                                        <Cell {...props}>
                                                            {filteredUnmatchedData[rowIndex][columnKey]}
                                                        </Cell>}
                                                    fixed={true}
                                                    width={200}
                                                />*/}
                                            </Table>
                                        </div>
                                        :processing?<Loading/>:<div>No files processed yet!</div>
                                }

                            </div>
                        </TabPane>
                        <TabPane tab="Matched Data" key="2">
                            <div>
                                {
                                    filteredMatchedData.length>0?
                                        <div style={{margin: 25}}>
                                            <div style={{marginBottom: 15}}>
                                                <a style={{marginLeft: 5}} target="_blank" href={'http://35.197.159.241:5000/data/matched.xlsx'}>Download in excel format</a>
                                            </div>
                                            <Input.Search
                                                placeholder="Filter by Customer Name"
                                                onSearch={this._filterMatched.bind(this,'Customer Name')}
                                                style={{ width: 200 }}
                                            />
                                            <span style={{display: 'inline-block',width: 100}}/>
                                            <Input.Search
                                                placeholder="Filter by Passport"
                                                onSearch={this._filterMatched.bind(this, 'Passport No.')}
                                                style={{ width: 200 }}
                                            />
                                            <Input.Search
                                                placeholder="Filter by Item"
                                                onSearch={this._filterMatched.bind(this, 'Item Description')}
                                                style={{ width: 300 }}
                                            />
                                            <Table
                                                rowHeight={50}
                                                rowsCount={filteredMatchedData.length}
                                                width={1000}
                                                height={500}
                                                headerHeight={50}
                                                data={filteredMatchedData}
                                            >
                                                <Column
                                                    header={<Cell>Customer Name</Cell>}
                                                    columnKey="Customer Name"
                                                    cell={({ rowIndex, columnKey, ...props }) =>
                                                        <Cell {...props}>
                                                            {filteredMatchedData[rowIndex][columnKey]}
                                                        </Cell>}
                                                    fixed={true}
                                                    width={200}
                                                />
                                                <Column
                                                    header={<Cell>Flight No</Cell>}
                                                    columnKey="Flight No."
                                                    cell={({ rowIndex, columnKey, ...props }) =>
                                                        <Cell {...props}>
                                                            {filteredMatchedData[rowIndex][columnKey]}
                                                        </Cell>}
                                                    fixed={true}
                                                    width={100}
                                                />
                                                <Column
                                                    header={<Cell>Passport</Cell>}
                                                    columnKey="Passport No."
                                                    cell={({ rowIndex, columnKey, ...props }) =>
                                                        <Cell {...props}>
                                                            {filteredMatchedData[rowIndex][columnKey]}
                                                        </Cell>}
                                                    fixed={true}
                                                    width={200}
                                                />
                                                <Column
                                                    header={<Cell>Item Desc</Cell>}
                                                    columnKey="Item Description"
                                                    cell={({ rowIndex, columnKey, ...props }) =>
                                                        <Cell {...props}>
                                                            {filteredMatchedData[rowIndex][columnKey]}
                                                        </Cell>}
                                                    fixed={true}
                                                    width={300}
                                                />
                                                <Column
                                                    header={<Cell>Quantity</Cell>}
                                                    columnKey="Quantity"
                                                    cell={({ rowIndex, columnKey, ...props }) =>
                                                        <Cell {...props}>
                                                            {filteredMatchedData[rowIndex][columnKey]}
                                                        </Cell>}
                                                    fixed={true}
                                                    width={100}
                                                />
                                                {/*<Column
                                                    header={<Cell>Name</Cell>}
                                                    columnKey="Name"
                                                    cell={({ rowIndex, columnKey, ...props }) =>
                                                        <Cell {...props}>
                                                            {filteredMatchedData[rowIndex][columnKey]}
                                                        </Cell>}
                                                    fixed={true}
                                                    width={200}
                                                />*/}
                                            </Table>
                                        </div>
                                        :processing?<Loading/>:<div>No files processed yet!</div>
                                }

                            </div>
                        </TabPane>
                    </Tabs>
                </Content>
            </Layout>
        )
    }

    _filterMatched(key, value){
        const {matchedData} = this.state;
        if(!value || value==""){
            this.setState({
                filteredMatchedData: matchedData
            })
            return;
        }
        let filterBy = value.toLowerCase();
        let filteredMatchedData = matchedData.filter((row) => {
            return row[key].toLowerCase().indexOf(filterBy) !== -1
        })
        if(filteredMatchedData == []){
            filteredMatchedData = matchedData
        }
        this.setState({
            filteredMatchedData
        });
    }

    _filterUnmatched(key, value){
        const {unmatchedData} = this.state;
        if(!value || value==""){
            this.setState({
                filteredUnmatchedData: unmatchedData
            })
            return;
        }
        let filterBy = value.toLowerCase();
        let filteredUnmatchedData = unmatchedData.filter((row) => {
            return row[key].toLowerCase().indexOf(filterBy) !== -1
        })
        if(filteredUnmatchedData == []){
            filteredUnmatchedData = unmatchedData
        }
        this.setState({
            filteredUnmatchedData
        });
    }

    _process(e){
        e.preventDefault();
        let self = this;
        self.setState({
            processing: true,
            matchedData:[],
            filteredMatchedData: [],
            unmatchedData: [],
            filteredUnmatchedData: []
        })
        fetch('http://35.197.159.241:5000', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({
                'apisFile': this.state.apisFile,
                'formCFile': this.state.formCFile
            }),
        }).then((res) => res.text())
            .then((data)=> {
                //let rows = JSON.parse(data)
                //console.log(typeof(data));
                data = JSON.parse(data);
                //console.log("Data:", data)
                //console.log(typeof(JSON.parse(data.matched)))
                let matchedData = JSON.parse(data.matched);
                let unmatchedData = JSON.parse(data.unmatched);
                self.setState({
                    processing: false,
                    matchedData: matchedData,
                    filteredMatchedData: matchedData,
                    unmatchedData: unmatchedData,
                    filteredUnmatchedData: unmatchedData
                })
            })
            .catch((err) => {
                self.setState({
                    processing: false
                })
                console.log("Fetch err", err)
            }
        );

    }

    _uploadApisFile(e){
        e.preventDefault();
        message.info("File Upload started!")
        var self = this;
        var fd = new FormData();
        //console.log(document.getElementById("fileApis"))
        var file = document.getElementById("fileApis").files[0];
        if(!file){
            return
        }
        self.setState({
            uploadingApis: true
        })
        fd.append('data', file)
        var fileName = file.name; //Should be 'picture.jpg'
        $.ajax({
            url: Environment.GCOOL_FILE_ENDPOINT,
            data: fd,
            type: 'POST',
            // THIS MUST BE DONE FOR FILE UPLOADING
            contentType: false,
            processData: false,
            // ... Other options like success and etc
            success: function(data){
                console.log("UPLOAD SUCCESS:", data);
                let file = JSON.parse(data);
                //console.log(file);
                message.success("APIS file uploaded successfully!")
                self.setState({
                    uploadingApis: false,
                    apisFile: file.url
                })
            },
            error: function(data){
                console.log("UPLOAD ERRRRRR:",data)
                message.error("Error uploading APIS file")
                self.setState({
                    uploadingApis: false
                })
            }
        })
    }

    _uploadFormCFile(e){
        e.preventDefault();
        message.info("File Upload started!")
        var self = this;
        var fd = new FormData();
        var file = document.getElementById('fileFormC').files[0];
        if(!file){
            return
        }
        self.setState({
            uploadingFormC: true
        })
        fd.append('data', file)
        var fileName = file.name; //Should be 'picture.jpg'
        $.ajax({
            url: Environment.GCOOL_FILE_ENDPOINT,
            data: fd,
            type: 'POST',
            // THIS MUST BE DONE FOR FILE UPLOADING
            contentType: false,
            processData: false,
            // ... Other options like success and etc
            success: function(data){
                console.log("UPLOAD SUCCESS:", data);
                let file = JSON.parse(data);
                //console.log(file);
                message.success("FormC file uploaded successfully!")
                self.setState({
                    uploadingFormC: false,
                    formCFile: file.url
                })
            },
            error: function(data){
                console.log("UPLOAD ERRRRRR:",data)
                message.error("Error uploading FormC file")
                self.setState({
                    uploadingFormC: false
                })
            }
        })
    }
}



const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    let ID = "64c8635e7616ed57d5b756d7";
    //beginning of tests
    // #1
    test('Create an issue with every field: POST request to /api/issues/{project}',  function (done) {
        this.timeout(10000)
        const newIssue = {
            issue_title: "title",
            issue_text: "text",
            created_by: "created_by",
            name: "test",
            assigned_to: "assigned_to",
            status_text: "status_text",
        };
        chai
            .request(server)
            .keepOpen()
            .post('/api/issues/test')
            .send(newIssue)
            .end( function (err, res) {
                let data = res.body;
                ID = data._id;
                console.log("obtained ID: ", ID);
                assert.equal(res.status, 200);
                assert.equal(data.assigned_to, "assigned_to")
                assert.equal(data.status_text, "status_text")
                assert.property(data, "_id")
                assert.isNumber(Date.parse(res.body.created_on));
                assert.property(data, 'updated_on');
                assert.isNumber(Date.parse(res.body.updated_on));
                assert.property(data, 'open');
                assert.isBoolean(data.open);
                assert.isTrue(data.open);
                assert.isNotEmpty(data._id);
                assert.property(data, 'status_text');
                assert.isNotEmpty(data.status_text);
            });
            
        done();
    });
    // #2
    test('Create an issue with only required fields: POST request to /api/issues/{project}',  function (done) {
        const newIssue = {
            issue_title: "title",
            issue_text: "text",
            created_by: "created_by",
            // name: "test",
            // assigned_to: "assigned_to",
            // status_text: "status_text",
        };
        chai
            .request(server)
            .keepOpen()
            .post('/api/issues/test')
            .send(newIssue)
            .end( function (err, res) {
                let data = res.body;
                assert.equal(res.status, 200);
                assert.property(data, "assigned_to");
                assert.property(data, "status_text");
                assert.property(data, "issue_title");
                assert.property(data, "issue_text");
                assert.property(data, "created_by");
                assert.property(data, "_id");
                assert.property(data, 'status_text');
                assert.property(data, 'open');
                assert.property(data, 'updated_on');
                assert.isNumber(Date.parse(res.body.created_on));
                assert.isNumber(Date.parse(res.body.updated_on));
                assert.isBoolean(data.open);
                assert.isTrue(data.open);
                assert.isNotEmpty(data._id);
                assert.isNotEmpty(data.issue_title);
                assert.isNotEmpty(data.issue_text);
                assert.isNotEmpty(data.created_by);
            });
            
        done();
    });
    // #3
    test('Create an issue with missing required fields: POST request to /api/issues/{project}',  function (done) {
        const newIssue = {
            // issue_title: "title",
            // issue_text: "text",
            // created_by: "created_by",
            name: "test",
            assigned_to: "assigned_to",
            status_text: "status_text",
        };
        chai
            .request(server)
            .keepOpen()
            .post('/api/issues/test')
            .send(newIssue)
            .end( function (err, res) {
                let data = res.body;
                assert.equal(data.error, 'required field(s) missing');
            });
            
        done();
    });
    // #4
    test('Create an issue with missing required fields: POST request to /api/issues/{project}',  function (done) {
        
        chai
            .request(server)
            .keepOpen()
            .get('/api/issues/test')
            .end( function (err, res) {
                let data = res.body;
                assert.isArray(data);
                data.forEach(issue => {
                    assert.property(issue, 'issue_title');
                    assert.property(issue, 'issue_text');
                    assert.property(issue, 'created_by');
                    assert.property(issue, 'assigned_to');
                    assert.property(issue, 'status_text');
                    assert.property(issue, 'open');
                    assert.property(issue, 'created_on');
                    assert.property(issue, 'updated_on');
                    assert.property(issue, '_id');
                });
            });
            
        done();
    });
    // #5
    test('View issues on a project with one filter: GET request to /api/issues/{project}',  function (done) {
        
        chai
            .request(server)
            .keepOpen()
            .get('/api/issues/test?issue_title=title')
            .end( function (err, res) {
                let data = res.body;
                assert.isArray(data);
                data.forEach(issue => {
                    assert.isObject(issue);
                    assert.property(issue, 'issue_title');
                    assert.equal(issue.issue_title, 'title');
                    assert.property(issue, 'issue_text');
                    assert.property(issue, 'created_by');
                    assert.property(issue, 'assigned_to');
                    assert.property(issue, 'status_text');
                    assert.property(issue, 'open');
                    assert.property(issue, 'created_on');
                    assert.property(issue, 'updated_on');
                    assert.property(issue, '_id');
                });
            });
            
        done();
    });
    // #6
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}',  function (done) {
        
        chai
            .request(server)
            .keepOpen()
            .get('/api/issues/test?issue_title=title&issue_text=text')
            .end( function (err, res) {
                let data = res.body;
                assert.isArray(data);
                data.forEach(issue => {
                    assert.property(issue, 'issue_title');
                    assert.equal(issue.issue_title, 'title');
                    assert.equal(issue.issue_text, 'text');
                    assert.property(issue, 'issue_text');
                    assert.property(issue, 'created_by');
                    assert.property(issue, 'assigned_to');
                    assert.property(issue, 'status_text');
                    assert.property(issue, 'open');
                    assert.property(issue, 'created_on');
                    assert.property(issue, 'updated_on');
                    assert.property(issue, '_id');
                });
            });
            
        done();
    });
    // #7
    test('Update one field on an issue: PUT request to /api/issues/{project}',  function (done) {
        console.log("The id TO update: ", ID)
       // ID = await ID
        const newIssue = {
            _id: ID,
            issue_title: "changed_title",
            issue_text: "text",
            created_by: "created_by",
            name: "test",
            assigned_to: "assigned_to",
            status_text: "status_text",
        };
        chai
            .request(server)
            .keepOpen()
            .put('/api/issues/test')
            .send(newIssue)
            .end( function (err, res) {
                let data = res.body;
                assert.equal(res.status, 200);
                assert.equal(data.result, 'successfully updated')
            });
            
        done();
    });
    // #8
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}',  function (done) {
        const newIssue = {
            _id: ID,
            issue_title: "changed_title",
            issue_text: "changed_text",
            created_by: "created_by",
            name: "test",
            assigned_to: "assigned_to",
            status_text: "status_text",
        };
        chai
            .request(server)
            .keepOpen()
            .put('/api/issues/test')
            .send(newIssue)
            .end( function (err, res) {
                let data = res.body;
                assert.equal(res.status, 200);
                assert.equal(data.result, 'successfully updated')
            });
            
        done();
    });
    // #9
    test('Update an issue with missing _id: PUT request to /api/issues/{project}',  function (done) {
        const newIssue = {
            issue_title: "changed_title",
            issue_text: "changed_text",
            created_by: "created_by",
            name: "test",
            assigned_to: "assigned_to",
            status_text: "status_text",
        };
        chai
            .request(server)
            .keepOpen()
            .put('/api/issues/test')
            .send(newIssue)
            .end( function (err, res) {
                let data = res.body;
                assert.equal(data.error, 'missing _id');
            });
            
        done();
    });
    // #10
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}',  function (done) {
        const newIssue = {
            _id: ID
        };
        chai
            .request(server)
            .keepOpen()
            .put('/api/issues/test')
            .send(newIssue)
            .end( function (err, res) {
                let data = res.body;
                assert.equal(data.error, 'no update field(s) sent');
                assert.equal(data._id, ID)
            });
            
        done();
    });
    // #11
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}',  function (done) {
        const newIssue = {
            _id: 1234,
            issue_title: "changed_title",
            issue_text: "changed_text",
            created_by: "created_by",
            name: "test",
            assigned_to: "assigned_to",
            status_text: "status_text",
        };
        chai
            .request(server)
            .keepOpen()
            .put('/api/issues/test')
            .send(newIssue)
            .end( function (err, res) {
                let data = res.body;
                assert.equal(data.error, 'could not update');
                assert.equal(data._id, 1234)
            });
            
        done();
    });
    // #12
    test('Delete an issue: DELETE request to /api/issues/{project}',  function (done) {
        const newIssue = {
            _id: ID
        };
        chai
            .request(server)
            .keepOpen()
            .delete('/api/issues/test')
            .send(newIssue)
            .end( function (err, res) {
                let data = res.body;
                assert.equal(data.result, 'successfully deleted');
                assert.equal(data._id, ID)
            });
            
        done();
    });
    // #13
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}',  function (done) {
        const newIssue = {
            _id: 1234
        };
        chai
            .request(server)
            .keepOpen()
            .delete('/api/issues/test')
            .send(newIssue)
            .end( function (err, res) {
                let data = res.body;
                assert.equal(data.error, 'could not delete');
                assert.equal(data._id, 1234)
            });
            
        done();
    });
    // // #14
    // test('Delete an issue with missing _id: DELETE request to /api/issues/{project}',  function (done) {
    //     const newIssue = { };
    //     chai
    //         .request(server)
    //         .keepOpen()
    //         .delete('/api/issues/test')
    //         .send(newIssue)
    //         .end( function (err, res) {
    //             let data = res.body;
    //             assert.equal(data.error, 'missing _id');
    //         });
            
    //     done();
    // });


    //end of tests
});

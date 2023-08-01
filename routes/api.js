'use strict';
const { request } = require('chai');
const { response } = require('express');
const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL;

module.exports = async function (app) {
  mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('connected to mongoose')
    }).catch(err => console.log("unable to connect to mongoose", err));
  let issueSchema = new mongoose.Schema({
    name: String,
    issue_title: {
      type: String,
      required: true
    },
    issue_text: {
      type: String,
      required: true
    },
    created_by: {
      type: String,
      required: true
    },
    assigned_to: String,
    status_text: String,
    open: {
      type: Boolean,
      default: true
    }
  }, { timestamps: true });

  let Issue = mongoose.model('Issue', issueSchema);

  app.route('/api/issues/:project')

    .get(function (req, res) {
    //  console.log("query from request: ", req.query);
      let project = req.params.project;
      Issue.find({ ...{ name: project }, ...req.query })
        .then((items) => {
          //console.log("received on data on /api/get/:project: ", items);
          let response = items.map(data => {
            return {
              assigned_to: data.assigned_to ? data.assigned_to : "",
              status_text: data.status_text ? data.status_text : "",
              open: data.open,
              _id: data.id,
              issue_title: data.issue_title,
              issue_text: data.issue_text,
              created_by: data.created_by,
              created_on: data.createdAt,
              updated_on: data.updatedAt
            };
          })
          res.send(response);
        }).catch(err => console.log("unable to get issues, ", err));
    })

    .post(async (req, res) => {
      let project = req.params.project;
      const newIssue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        name: project,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
      };

      try {
        let data = await Issue.create(newIssue);
        let response = {
          assigned_to: data.assigned_to ? data.assigned_to : "",
          status_text: data.status_text ? data.status_text : "",
          open: data.open,
          _id: data.id,
          issue_title: data.issue_title,
          issue_text: data.issue_text,
          created_by: data.created_by,
          created_on: data.createdAt,
          updated_on: data.updatedAt
        };
        // console.log("New issue was created successfully", data, "response: ", response);
        res.status(200).send(response);
      } catch (err) {
        console.log('Unable to create an issue - Required field(s) missing:');
        res.send({ error: 'required field(s) missing' });
      }
    })


    .put(async (req, res) => {
      let project = req.params.project;
      let body = req.body;
      let values = Object.values(body).join('');
     // console.log("received body: ", body, "values: ", values);
      if (body._id) {
        if (values === body._id) {
       //   console.log({ error: 'no update field(s) sent', '_id': body._id });
          res.json({ error: 'no update field(s) sent', '_id': body._id });
        } else {
          try {
            const updatedIssue = await Issue.findByIdAndUpdate(body._id, { ...body, ...{ name: project } }); if (updatedIssue) {
            //  console.log("updated issue:", updatedIssue);
              res.send({ result: 'successfully updated', _id: body._id });
            } else {
            //  console.log({ error: 'could not update', '_id': body._id })
              res.json({ error: 'could not update', '_id': body._id });
            }
          } catch (err) {
           // console.log({ error: 'could not update', '_id': body._id })
            res.json({ error: 'could not update', '_id': body._id });
          }
        }
      } else {
      //  console.log({ error: 'missing _id' });
        res.json({ error: 'missing _id' });
      }
    })

    .delete(async function (req, res) {
      let project = req.params.project;
      let ID = req.body._id;
    //  console.log("Id to delete: ", ID)
      if (ID) {
        Issue.findByIdAndRemove(ID)
          .then((removed) => {
           // console.log('removedIss: ', removed);
            if (removed) {
           //   console.log({ result: 'successfully deleted', '_id': ID });
              res.send({ result: 'successfully deleted', '_id': ID })
            } else {
            //  console.log({ error: 'could not delete', '_id': ID });
              res.send({ error: 'could not delete', '_id': ID })
            }
          }).catch(err => {
          //  console.log({ error: 'could not delete: error when finding Id', '_id': req.body._id });
            res.send({ error: 'could not delete', '_id': ID })
          })
      } else {
       // console.log({ error: 'missing _id' });
        res.send({ error: 'missing _id' });
      }
    });
};


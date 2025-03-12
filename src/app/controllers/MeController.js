const Course = require('../Models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');

class MeController {
  // [GET] /me/stored/courses
  storedCourses(req, res,next) {

    let courseQuery = Course.find({});

    if(req.query.hasOwnProperty('_sort')){
      courseQuery = courseQuery.sort({
        [req.query.column]:req.query.type,
      });
    }

    Promise.all([courseQuery,Course.countDocumentsWithDeleted({ deleted: true })])
      .then(([courses,deletedCount])=>{
        res.render('me/stored-courses',{
          courses: multipleMongooseToObject(courses),
          deletedCount,
        })
      })
      .catch(next);


    // Course.countDocumentsWithDeleted({ deleted: true })
    //   .then((deletedCount)=>{
    //     console.log(deletedCount)
    //   })
    //   .catch(()=>{})
    // Course.find({})
    //   .then(courses=>res.render('me/stored-courses',{courses: multipleMongooseToObject(courses)}))
    //   .catch(next);
  }

  // [GET] /me/trash/courses
  trashCourses(req, res,next) {
    Course.findWithDeleted({deleted: true})
      .then(courses=>res.render('me/trash-courses',{courses: multipleMongooseToObject(courses)}))
      .catch(next);
  }
}

module.exports = new MeController();

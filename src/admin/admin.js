const AdminJS = require('adminjs');
const AdminJSMongoose = require('@adminjs/mongoose');
const Course = require('../models/Course');
const TableOfContent = require('../models/TableOfContent');
const Chapter = require('../models/Chapter');
const Homework = require('../models/Homeworks');

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const createAdminPanel = () => {
  const adminOptions = {
    rootPath: '/admin',
    branding: {
      companyName: 'CodeSchool Admin',
      softwareBrothers: false,
      logo: false,
    },
    locale: {
      language: 'en',
      availableLanguages: ['en'],
      translations: {
        en: {
          resources: {
            Course: {
              name: 'Courses',
              properties: {
                name: 'Course Name',
                author: 'Author',
                sectionCount: 'Section Count',
                stack: 'Stack',
                description: 'Description',
                projectPicture: 'Course Picture',
                tableOfContent: 'Table of Contents',
                createdAt: 'Created At',
                updatedAt: 'Updated At',
              },
            },
            TableOfContent: {
              name: 'Table of Contents',
              properties: {
                order: 'Order',
                title: 'Title',
                chapter: 'Chapters',
                courseId: 'Course',
                createdAt: 'Created At',
                updatedAt: 'Updated At',
              },
            },
            Chapter: {
              name: 'Chapters',
              properties: {
                chapterNumber: 'Chapter Number',
                chapterTitle: 'Chapter Title',
                description: 'Description',
                realLifeExample: 'Real Life Example',
                codingExample: 'Coding Example',
                imageUrl: 'Image',
                task: 'Task',
                projectTask: 'Project Task',
                stack: 'Stack',
                tocId: 'Table of Content',
                homework: 'Homework',
                createdAt: 'Created At',
                updatedAt: 'Updated At',
              },
            },
            Homework: {
              name: 'Homework',
              properties: {
                order: 'Order',
                question: 'Question',
                help: 'Help',
                correctAnswer: 'Correct Answer',
                description: 'Description',
                initialCode: 'Initial Code',
                chapterId: 'Chapter',
                createdAt: 'Created At',
                updatedAt: 'Updated At',
              },
            },
          },
        },
      },
    },

    resources: [
      {
        resource: Course,
        options: {
          properties: {
            name: {
              isTitle: true,
            },
            projectPicture: {
              isVisible: { list: true, filter: false, show: true, edit: true },
            },
            description: {
              type: 'textarea',
              props: {
                rows: 4,
              },
            },
            tableOfContent: {
              isVisible: {
                list: false,
                filter: false,
                show: true,
                edit: false,
              },
            },
            createdAt: {
              isVisible: { list: true, filter: true, show: true, edit: false },
            },
            updatedAt: {
              isVisible: { list: true, filter: true, show: true, edit: false },
            },
          },
          listProperties: [
            'name',
            'author',
            'stack',
            'sectionCount',
            'projectPicture',
            'createdAt',
          ],
          actions: {
            delete: {
              handler: async (request, response, context) => {
                const { record, resource } = context;
                try {
                  const courseId = record.id();
                  const course = await Course.findById(courseId);

                  if (course && course.tableOfContent.length > 0) {
                    await TableOfContent.deleteMany({
                      _id: { $in: course.tableOfContent },
                    });
                  }

                  await Course.findByIdAndDelete(courseId);

                  return {
                    record: record.toJSON(),
                    redirectUrl: resource.href(),
                    notice: {
                      message: 'Successfully deleted',
                      type: 'success',
                    },
                  };
                } catch (error) {
                  return {
                    record: record.toJSON(),
                    notice: {
                      message: error.message,
                      type: 'error',
                    },
                  };
                }
              },
            },
          },
        },
      },

      {
        resource: TableOfContent,
        options: {
          properties: {
            title: {
              isTitle: true,
            },
            chapter: {
              isVisible: {
                list: false,
                filter: false,
                show: true,
                edit: false,
              },
            },
            createdAt: {
              isVisible: { list: true, filter: true, show: true, edit: false },
            },
            updatedAt: {
              isVisible: { list: true, filter: true, show: true, edit: false },
            },
          },
          listProperties: ['order', 'title', 'courseId', 'createdAt'],
          actions: {
            new: {
              after: async (response, request, context) => {
                const tocId = response.record.id;
                const courseId = response.record.params.courseId;

                if (courseId) {
                  await Course.findByIdAndUpdate(
                    courseId,
                    { $addToSet: { tableOfContent: tocId } },
                    { new: true }
                  );
                }

                return response;
              },
            },
            edit: {
              before: async (request, context) => {
                const tocId = context.record.id();
                const toc = await TableOfContent.findById(tocId);

                if (toc) {
                  request._oldCourseId = toc.courseId.toString();
                }

                return request;
              },
              after: async (response, request, context) => {
                const tocId = response.record.id;
                const newCourseId = response.record.params.courseId;
                const oldCourseId = request._oldCourseId;

                if (
                  oldCourseId &&
                  newCourseId &&
                  newCourseId.toString() !== oldCourseId
                ) {
                  await Course.findByIdAndUpdate(oldCourseId, {
                    $pull: { tableOfContent: tocId },
                  });

                  await Course.findByIdAndUpdate(newCourseId, {
                    $addToSet: { tableOfContent: tocId },
                  });
                }

                return response;
              },
            },
            delete: {
              handler: async (request, response, context) => {
                const { record, resource } = context;
                try {
                  const tocId = record.id();
                  const courseId = record.params.courseId;
                  const toc = await TableOfContent.findById(tocId);

                  if (courseId) {
                    await Course.findByIdAndUpdate(courseId, {
                      $pull: { tableOfContent: tocId },
                    });
                  }

                  if (toc && toc.chapter.length > 0) {
                    await Chapter.deleteMany({ _id: { $in: toc.chapter } });
                  }

                  await TableOfContent.findByIdAndDelete(tocId);

                  return {
                    record: record.toJSON(),
                    redirectUrl: resource.href(),
                    notice: {
                      message: 'Successfully deleted',
                      type: 'success',
                    },
                  };
                } catch (error) {
                  return {
                    record: record.toJSON(),
                    notice: {
                      message: error.message,
                      type: 'error',
                    },
                  };
                }
              },
            },
          },
        },
      },

      {
        resource: Chapter,
        options: {
          properties: {
            chapterTitle: {
              isTitle: true,
            },
            chapterNumber: {
              isRequired: true,
            },
            stack: {
              type: 'select',
              availableValues: [
                { value: 'python', label: 'Python' },
                { value: 'html', label: 'HTML' },
              ],
              isVisible: { list: true, filter: true, show: true, edit: true },
              isRequired: false,
            },
            imageUrl: {
              isVisible: { list: true, filter: false, show: true, edit: true },
            },
            description: {
              type: 'textarea',
              props: {
                rows: 4,
              },
              hint: 'You can use <b>bold text</b> or <strong>strong text</strong> tags for bold formatting',
              isRequired: false,
            },
            realLifeExample: {
              type: 'textarea',
              props: {
                rows: 4,
              },
              hint: 'You can use <b>bold text</b> or <strong>strong text</strong> tags for bold formatting',
              isRequired: false,
            },
            codingExample: {
              type: 'textarea',
              props: {
                rows: 6,
              },
              hint: 'You can use <b>bold text</b> or <strong>strong text</strong> tags for bold formatting',
              isRequired: false,
            },
            task: {
              type: 'textarea',
              props: {
                rows: 3,
              },
              hint: 'You can use <b>bold text</b> or <strong>strong text</strong> tags for bold formatting',
              isRequired: false,
            },
            projectTask: {
              type: 'textarea',
              props: {
                rows: 4,
              },
              hint: 'You can use <b>bold text</b> or <strong>strong text</strong> tags for bold formatting. This field is for project-related tasks.',
              isRequired: false,
            },
            tocId: {
              isRequired: true,
            },
            homework: {
              isVisible: {
                list: false,
                filter: false,
                show: true,
                edit: false,
              },
            },
            createdAt: {
              isVisible: { list: true, filter: true, show: true, edit: false },
            },
            updatedAt: {
              isVisible: { list: true, filter: true, show: true, edit: false },
            },
          },
          listProperties: [
            'chapterNumber',
            'chapterTitle',
            'stack',
            'tocId',
            'imageUrl',
            'createdAt',
          ],
          actions: {
            new: {
              after: async (response, request, context) => {
                const chapterId = response.record.id;
                const tocId = response.record.params.tocId;

                if (tocId) {
                  await TableOfContent.findByIdAndUpdate(
                    tocId,
                    { $addToSet: { chapter: chapterId } },
                    { new: true }
                  );
                }

                return response;
              },
            },
            edit: {
              before: async (request, context) => {
                const chapterId = context.record.id();
                const chapter = await Chapter.findById(chapterId);

                if (chapter) {
                  request._oldTocId = chapter.tocId.toString();
                }

                return request;
              },
              after: async (response, request, context) => {
                const chapterId = response.record.id;
                const newTocId = response.record.params.tocId;
                const oldTocId = request._oldTocId;

                if (oldTocId && newTocId && newTocId.toString() !== oldTocId) {
                  await TableOfContent.findByIdAndUpdate(oldTocId, {
                    $pull: { chapter: chapterId },
                  });

                  await TableOfContent.findByIdAndUpdate(newTocId, {
                    $addToSet: { chapter: chapterId },
                  });
                }

                return response;
              },
            },
            delete: {
              handler: async (request, response, context) => {
                const { record, resource } = context;
                try {
                  const chapterId = record.id();
                  const tocId = record.params.tocId;
                  const chapter = await Chapter.findById(chapterId);

                  if (tocId) {
                    await TableOfContent.findByIdAndUpdate(tocId, {
                      $pull: { chapter: chapterId },
                    });
                  }

                  if (chapter && chapter.homework.length > 0) {
                    await Homework.deleteMany({
                      _id: { $in: chapter.homework },
                    });
                  }

                  await Chapter.findByIdAndDelete(chapterId);

                  return {
                    record: record.toJSON(),
                    redirectUrl: resource.href(),
                    notice: {
                      message: 'Successfully deleted',
                      type: 'success',
                    },
                  };
                } catch (error) {
                  return {
                    record: record.toJSON(),
                    notice: {
                      message: error.message,
                      type: 'error',
                    },
                  };
                }
              },
            },
          },
        },
      },

      {
        resource: Homework,
        options: {
          properties: {
            question: {
              isTitle: true,
              type: 'textarea',
              props: {
                rows: 3,
              },
              hint: 'The homework question or task description',
            },
            order: {
              isRequired: true,
            },
            help: {
              type: 'textarea',
              props: {
                rows: 3,
              },
              hint: 'Helpful hints or guidance for completing the homework',
              isRequired: false,
            },
            correctAnswer: {
              type: 'textarea',
              props: {
                rows: 6,
              },
              hint: 'The correct answer or solution code for this homework',
              isRequired: true,
            },
            description: {
              type: 'textarea',
              props: {
                rows: 4,
              },
              hint: 'You can use <b>bold text</b> or <strong>strong text</strong> tags for bold formatting',
              isRequired: false,
            },
            initialCode: {
              type: 'textarea',
              props: {
                rows: 6,
              },
              hint: 'Initial code template for the homework',
              isRequired: false,
            },
            chapterId: {
              isRequired: true,
            },
            createdAt: {
              isVisible: { list: true, filter: true, show: true, edit: false },
            },
            updatedAt: {
              isVisible: { list: true, filter: true, show: true, edit: false },
            },
          },
          listProperties: ['order', 'question', 'chapterId', 'createdAt'],
          actions: {
            new: {
              after: async (response, request, context) => {
                const homeworkId = response.record.id;
                const chapterId = response.record.params.chapterId;

                if (chapterId) {
                  await Chapter.findByIdAndUpdate(
                    chapterId,
                    { $addToSet: { homework: homeworkId } },
                    { new: true }
                  );
                }

                return response;
              },
            },
            edit: {
              before: async (request, context) => {
                const homeworkId = context.record.id();
                const homework = await Homework.findById(homeworkId);

                if (homework) {
                  request._oldChapterId = homework.chapterId.toString();
                }

                return request;
              },
              after: async (response, request, context) => {
                const homeworkId = response.record.id;
                const newChapterId = response.record.params.chapterId;
                const oldChapterId = request._oldChapterId;

                if (
                  oldChapterId &&
                  newChapterId &&
                  newChapterId.toString() !== oldChapterId
                ) {
                  await Chapter.findByIdAndUpdate(oldChapterId, {
                    $pull: { homework: homeworkId },
                  });

                  await Chapter.findByIdAndUpdate(newChapterId, {
                    $addToSet: { homework: homeworkId },
                  });
                }

                return response;
              },
            },
            delete: {
              handler: async (request, response, context) => {
                const { record, resource } = context;
                try {
                  const homeworkId = record.id();
                  const chapterId = record.params.chapterId;

                  if (chapterId) {
                    await Chapter.findByIdAndUpdate(chapterId, {
                      $pull: { homework: homeworkId },
                    });
                  }

                  await Homework.findByIdAndDelete(homeworkId);

                  return {
                    record: record.toJSON(),
                    redirectUrl: resource.href(),
                    notice: {
                      message: 'Successfully deleted',
                      type: 'success',
                    },
                  };
                } catch (error) {
                  return {
                    record: record.toJSON(),
                    notice: {
                      message: error.message,
                      type: 'error',
                    },
                  };
                }
              },
            },
          },
        },
      },
    ],
  };

  const admin = new AdminJS(adminOptions);
  return admin;
};

module.exports = createAdminPanel;

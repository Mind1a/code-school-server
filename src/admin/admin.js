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
      availableLanguages: ['en', 'ka'],
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
                subTitle: 'Subtitle',
                description: 'Description',
                realLifeExample: 'Real Life Example',
                codingExample: 'Coding Example',
                imageUrl: 'Image',
                task: 'Task',
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
                chapterId: 'Chapter',
                createdAt: 'Created At',
                updatedAt: 'Updated At',
              },
            },
          },
        },
        ka: {
          resources: {
            Course: {
              name: 'კურსები',
              properties: {
                name: 'კურსის სახელი',
                author: 'ავტორი',
                sectionCount: 'სექციების რაოდენობა',
                stack: 'სტეკი',
                description: 'აღწერა',
                projectPicture: 'კურსის სურათი',
                tableOfContent: 'სარჩევი',
                createdAt: 'შექმნის თარიღი',
                updatedAt: 'განახლების თარიღი',
              },
            },
            TableOfContent: {
              name: 'სარჩევი',
              properties: {
                order: 'რიგითობა',
                title: 'სათაური',
                chapter: 'თავები',
                courseId: 'კურსი',
                createdAt: 'შექმნის თარიღი',
                updatedAt: 'განახლების თარიღი',
              },
            },
            Chapter: {
              name: 'თავები',
              properties: {
                chapterNumber: 'თავის ნომერი',
                chapterTitle: 'თავის სახელი',
                subTitle: 'ქვესათაური',
                description: 'აღწერა',
                realLifeExample: 'რეალური მაგალითი',
                codingExample: 'კოდის მაგალითი',
                imageUrl: 'სურათი',
                task: 'დავალება',
                tocId: 'სარჩევი',
                homework: 'საშინაო დავალება',
                createdAt: 'შექმნის თარიღი',
                updatedAt: 'განახლების თარიღი',
              },
            },
            Homework: {
              name: 'საშინაო დავალებები',
              properties: {
                order: 'რიგითობა',
                question: 'კითხვა',
                help: 'დახმარება',
                correctAnswer: 'სწორი პასუხი',
                chapterId: 'თავი',
                createdAt: 'შექმნის თარიღი',
                updatedAt: 'განახლების თარიღი',
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
                  await Course.findByIdAndDelete(record.id());
                  return {
                    record: record.toJSON(),
                    redirectUrl: resource.href(),
                    notice: {
                      message: 'წარმატებით წაიშალა',
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
            delete: {
              handler: async (request, response, context) => {
                const { record, resource } = context;
                try {
                  await TableOfContent.findByIdAndDelete(record.id());
                  return {
                    record: record.toJSON(),
                    redirectUrl: resource.href(),
                    notice: {
                      message: 'წარმატებით წაიშალა',
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
            imageUrl: {
              isVisible: { list: true, filter: false, show: true, edit: true },
            },
            description: {
              type: 'textarea',
              props: {
                rows: 4,
              },
            },
            realLifeExample: {
              type: 'textarea',
              props: {
                rows: 4,
              },
            },
            codingExample: {
              type: 'textarea',
              props: {
                rows: 6,
              },
            },
            task: {
              type: 'textarea',
              props: {
                rows: 3,
              },
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
            'tocId',
            'imageUrl',
            'createdAt',
          ],
          actions: {
            delete: {
              handler: async (request, response, context) => {
                const { record, resource } = context;
                try {
                  await Chapter.findByIdAndDelete(record.id());
                  return {
                    record: record.toJSON(),
                    redirectUrl: resource.href(),
                    notice: {
                      message: 'წარმატებით წაიშალა',
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
            },
            help: {
              type: 'textarea',
              props: {
                rows: 3,
              },
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
            delete: {
              handler: async (request, response, context) => {
                const { record, resource } = context;
                try {
                  await Homework.findByIdAndDelete(record.id());
                  return {
                    record: record.toJSON(),
                    redirectUrl: resource.href(),
                    notice: {
                      message: 'წარმატებით წაიშალა',
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

import { Course } from '../models/course.model';

export const COURSES: Course[] = [

  {
    id: 1,
    title: 'Core Java',
    slug: 'core-java',
    description:
      'Learn Java programming from basics to advanced level and prepare for real-world development.',
    duration: '8 Weeks',
    level: 'Beginner',
    mode: 'Online',
    fee: 50,
    icon: '☕',

    features: [
      'Java Basics',
      'OOP Concepts',
      'Collections Framework',
      'Exception Handling',
      'Multithreading',
      'Java 8 Features'
    ],

    curriculum: [
      'Java Basics',
      'Data Types & Variables',
      'Operators',
      'Control Statements',
      'Arrays',
      'Strings',
      'OOP Concepts',
      'Inheritance',
      'Polymorphism',
      'Abstraction',
      'Interfaces',
      'Exception Handling',
      'Collections Framework',
      'Generics',
      'Multithreading',
      'Java 8 Features'
    ]
  },

  {
    id: 2,
    title: 'Spring Boot',
    slug: 'spring-boot',
    description:
      'Build production-ready enterprise applications using Spring Boot and Spring technologies.',
    duration: '8 Weeks',
    level: 'Intermediate',
    mode: 'Online',
    fee: 12999,
    icon: '🌱',

    features: [
      'Spring Framework',
      'Spring Boot',
      'Spring MVC',
      'Spring Data JPA',
      'Spring Security',
      'REST APIs'
    ],

    curriculum: [
      'Spring Framework Overview',
      'Spring Boot Basics',
      'Dependency Injection',
      'Spring MVC',
      'RESTful Web Services',
      'Spring Data JPA',
      'Hibernate',
      'Validation',
      'Exception Handling',
      'Spring Security',
      'Actuator',
      'Testing',
      'Deployment'
    ]
  },

  {
    id: 3,
    title: 'Microservices',
    slug: 'microservices',
    description:
      'Design and develop scalable microservices applications using Spring Cloud.',
    duration: '10 Weeks',
    level: 'Advanced',
    mode: 'Online',
    fee: 15999,
    icon: '🔗',

    features: [
      'Microservices Architecture',
      'Spring Cloud',
      'Eureka',
      'API Gateway',
      'Kafka',
      'Docker'
    ],

    curriculum: [
      'Microservices Architecture',
      'Spring Cloud',
      'Eureka Naming Server',
      'API Gateway',
      'Config Server',
      'Feign Client',
      'Circuit Breaker',
      'Resilience4j',
      'Kafka',
      'RabbitMQ',
      'Docker',
      'Deployment'
    ]
  },

  {
    id: 4,
    title: 'SQL & Databases',
    slug: 'sql-databases',
    description:
      'Master SQL and relational database concepts required for backend development.',
    duration: '6 Weeks',
    level: 'Beginner',
    mode: 'Online',
    fee: 7999,
    icon: '🗄️',

    features: [
      'SQL Basics',
      'Joins',
      'Indexes',
      'Transactions',
      'PostgreSQL',
      'MySQL'
    ],

    curriculum: [
      'SQL Basics',
      'DDL',
      'DML',
      'Joins',
      'Subqueries',
      'Aggregate Functions',
      'Normalization',
      'Indexes',
      'Stored Procedures',
      'Transactions',
      'PostgreSQL',
      'MySQL'
    ]
  },

  {
    id: 5,
    title: 'Docker',
    slug: 'docker',
    description:
      'Learn Docker containers, images and deployment practices.',
    duration: '6 Weeks',
    level: 'Beginner',
    mode: 'Online',
    fee: 6999,
    icon: '🐳',

    features: [
      'Docker Basics',
      'Docker Images',
      'Containers',
      'Docker Compose',
      'Volumes',
      'Deployment'
    ],

    curriculum: [
      'Docker Basics',
      'Docker Images',
      'Containers',
      'Dockerfile',
      'Docker Compose',
      'Volumes',
      'Networks',
      'Environment Variables',
      'Docker Registry',
      'Deployment'
    ]
  },

  {
    id: 6,
    title: 'Full Stack Java',
    slug: 'full-stack-java',
    description:
      'Complete Java Full Stack Developer program covering frontend, backend and databases.',
    duration: '16 Weeks',
    level: 'Advanced',
    mode: 'Online',
    fee: 18999,
    icon: '💻',

    features: [
      'Core Java',
      'Spring Boot',
      'Microservices',
      'SQL',
      'Angular',
      'Docker'
    ],

    curriculum: [
      'Core Java',
      'Java 8 Features',
      'Spring Framework',
      'Spring Boot',
      'REST APIs',
      'Spring Data JPA',
      'Spring Security',
      'Microservices',
      'Kafka',
      'SQL',
      'Angular',
      'Docker',
      'Jenkins',
      'AWS Basics',
      'Project',
      'Interview Preparation'
    ]
  },

  {
    id: 7,
    title: 'AWS Basics',
    slug: 'aws-basics',
    description:
      'Learn the fundamentals of AWS cloud services and deployment.',
    duration: '6 Weeks',
    level: 'Beginner',
    mode: 'Online',
    fee: 6999,
    icon: '☁️',

    features: [
      'EC2',
      'S3',
      'RDS',
      'Lambda',
      'IAM',
      'Cloud Deployment'
    ],

    curriculum: [
      'Cloud Computing Basics',
      'AWS Account',
      'IAM',
      'EC2',
      'S3',
      'RDS',
      'Lambda',
      'CloudWatch',
      'VPC Basics',
      'Application Deployment'
    ]
  },

  {
    id: 8,
    title: 'Spring Security',
    slug: 'spring-security',
    description:
      'Learn authentication and authorization using Spring Security.',
    duration: '6 Weeks',
    level: 'Intermediate',
    mode: 'Online',
    fee: 6999,
    icon: '🔐',

    features: [
      'Authentication',
      'Authorization',
      'JWT',
      'OAuth2',
      'Role Based Security'
    ],

    curriculum: [
      'Spring Security Overview',
      'Authentication',
      'Authorization',
      'Password Encoding',
      'JWT',
      'Role Based Access',
      'OAuth2',
      'Security Filters',
      'Method Security',
      'Security Best Practices'
    ]
  }

];
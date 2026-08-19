import { Service } from '../models/service.model';

export const SERVICES: Service[] = [

  {
    slug: 'core-java',
    name: 'Core Java',
    icon: '☕',

    description:
      'Learn Java programming from fundamentals to advanced concepts.',

    overview:
      'Core Java is the foundation of all Java technologies. This module covers all the basics to advanced concepts.',

    contents: [
      'Java Basics',
      'OOPs Concepts',
      'Data Types & Variables',
      'Operators',
      'Control Statements',
      'Arrays',
      'Strings',
      'Collections Framework',
      'Exception Handling',
      'Multithreading',
      'File Handling',
      'Lambda Expressions'
    ]
  },

  {
    slug: 'spring-boot',
    name: 'Spring Boot',
    icon: '🌱',

    description:
      'Build production-ready enterprise applications using Spring Boot.',

    overview:
      'Learn to build enterprise grade applications using Spring Boot with industry best practices.',

    contents: [
      'Spring Framework Overview',
      'Spring Boot Basics',
      'Spring MVC',
      'Spring Data JPA',
      'RESTful Web Services',
      'Validation',
      'Spring Security',
      'Actuator',
      'Deployment'
    ]
  },

  {
    slug: 'microservices',
    name: 'Microservices',
    icon: '🔗',

    description:
      'Design and build scalable microservices applications.',

    overview:
      'Learn to design, develop and deploy microservices architecture using Spring Cloud.',

    contents: [
      'Microservices Architecture',
      'Spring Cloud Overview',
      'Eureka Naming Server',
      'API Gateway',
      'Config Server',
      'Feign Client',
      'Circuit Breaker (Resilience4j)',
      'RabbitMQ Integration',
      'Docker & Deployment'
    ]
  },

  {
    slug: 'sql',
    name: 'SQL & Databases',
    icon: '🗄️',

    description:
      'Learn SQL and database concepts required for backend development.',

    overview:
      'Master SQL and relational database concepts to design and optimize databases.',

    contents: [
      'SQL Basics',
      'Joins',
      'Subqueries',
      'Aggregate Functions',
      'Normalization',
      'Indexing',
      'Stored Procedures',
      'Transactions',
      'PostgreSQL / MySQL'
    ]
  },

  {
    slug: 'docker',
    name: 'Docker',
    icon: '🐳',

    description:
      'Containerize and deploy applications using Docker.',

    overview:
      'Learn containerization with Docker and deploy applications consistently across environments.',

    contents: [
      'Docker Basics',
      'Docker Images',
      'Docker Containers',
      'Docker Compose',
      'Volumes & Networks',
      'Dockerfile',
      'Best Practices',
      'Deployment'
    ]
  }

];
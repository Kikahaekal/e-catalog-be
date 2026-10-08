import swaggerJsdoc from 'swagger-jsdoc';
import type { SwaggerUiOptions } from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'E-Catalog API',
      version: '1.0.0',
      description: 'API katalog spesies ikan dan referensi data daerah Indonesia.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Authentication', description: 'Autentikasi pengguna' },
      { name: 'Fish Submissions', description: 'Pengajuan data ikan dari pengguna' },
      { name: 'IUCN', description: 'Status konservasi IUCN' },
      { name: 'Regency', description: 'Data kabupaten/kota dan provinsi' },
      { name: 'WPP', description: 'Wilayah Pengelolaan Perikanan' },
      { name: 'Species', description: 'Data spesies ikan' },
      { name: 'References', description: 'Referensi ilmiah dan sumber data' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Masukkan token JWT dari endpoint login.',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', description: 'Pesan kesalahan' },
          },
          required: ['error'],
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
          },
          required: ['email', 'password'],
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            token: { type: 'string' },
            role: { type: 'string' },
          },
          required: ['message', 'token', 'role'],
        },
        FishSubmissionRequest: {
          type: 'object',
          properties: {
            submittedName: { type: 'string' },
            locationNote: { type: 'string', nullable: true },
            submitterName: { type: 'string', nullable: true },
            photoFilePath: { type: 'string', description: 'URL foto yang diberikan sebagai alternative data file. Gunakan form-data multipart saat mengunggah foto.' },
          },
          required: ['submittedName'],
        },
        FishSubmission: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            submittedName: { type: 'string' },
            photoFilePath: { type: 'string' },
            locationNote: { type: 'string', nullable: true },
            submitterName: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        SpeciesCreateRequest: {
          type: 'object',
          properties: {
            iucnStatusId: { type: 'integer', nullable: true },
            commonName: { type: 'string' },
            scientificName: { type: 'string' },
            author: { type: 'string', nullable: true },
            etymology: { type: 'string', nullable: true },
            order: { type: 'string', nullable: true },
            family: { type: 'string', nullable: true },
            genus: { type: 'string', nullable: true },
            environment: { type: 'string', nullable: true },
            climateZone: { type: 'string', nullable: true },
            depthMinMeters: { type: 'number', nullable: true },
            depthMaxMeters: { type: 'number', nullable: true },
            tempMinC: { type: 'number', nullable: true },
            tempMaxC: { type: 'number', nullable: true },
            distributionText: { type: 'string', nullable: true },
            maxLengthCm: { type: 'number', nullable: true },
            lengthType: { type: 'string', nullable: true },
            maxWeightKg: { type: 'number', nullable: true },
            maxAgeYears: { type: 'number', nullable: true },
            dorsalSpines: { type: 'integer', nullable: true },
            dorsalSoftRays: { type: 'integer', nullable: true },
            analSpines: { type: 'integer', nullable: true },
            analSoftRays: { type: 'integer', nullable: true },
            bodyShape: { type: 'string', nullable: true },
            morphologyText: { type: 'string', nullable: true },
            biologyText: { type: 'string', nullable: true },
            fecundityText: { type: 'string', nullable: true },
            threatToHumans: { type: 'string', nullable: true },
            fisheriesImportance: { type: 'string', nullable: true },
            isGamefish: { type: 'boolean', nullable: true },
            iucnAssessedAt: { type: 'string', format: 'date-time', nullable: true },
            citesStatus: { type: 'string', nullable: true },
            cmsStatus: { type: 'string', nullable: true },
            wppIds: { type: 'array', items: { type: 'integer' } },
            regencyIds: { type: 'array', items: { type: 'integer' } },
            synonyms: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  scientificName: { type: 'string' },
                  author: { type: 'string', nullable: true },
                  status: { type: 'string', nullable: true },
                },
                required: ['scientificName'],
              },
            },
            references: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  referenceId: { type: 'integer' },
                  isMainRef: { type: 'boolean' },
                },
                required: ['referenceId'],
              },
            },
          },
          required: ['commonName', 'scientificName'],
        },
        IucnRequest: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            name: { type: 'string' },
          },
          required: ['code', 'name'],
        },
        RegencyRequest: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            province: { type: 'string' },
          },
          required: ['name', 'province'],
        },
        WppRequest: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            description: { type: 'string' },
          },
          required: ['code', 'description'],
        },
        ReferenceRequest: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            author: { type: 'string', nullable: true },
            year: { type: 'integer', nullable: true },
            source: { type: 'string', nullable: true },
            url: { type: 'string', nullable: true },
          },
          required: ['title'],
        },
        IdParam: {
          type: 'string',
          description: 'Identifier unik sebagai path parameter',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const swaggerUiOptions: SwaggerUiOptions = {
  customSiteTitle: 'E-Catalog API Documentation',
};

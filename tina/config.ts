import { defineConfig } from 'tinacms';

const displayFields: any[] = [
  { type: 'boolean', name: 'fullscreen', label: 'Pantalla completa' },
  { type: 'string', name: 'bgColor', label: 'Color de fondo', ui: { component: 'color' } },
  { type: 'string', name: 'textColor', label: 'Color de texto', ui: { component: 'color' } },
];

export default defineConfig({
  branch: 'master',
  clientId: '',
  token: '',
  build: {
    outputFolder: 'tina-admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'assets/img',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'page',
        label: 'Páginas',
        path: 'src/content/pages',
        format: 'mdx',
        ui: {
          router: () => '/',
          allowedActions: { create: false, delete: false },
        },
        fields: [
          { type: 'string', name: 'title', label: 'Título de la página' },
          {
            type: 'object',
            name: 'blocks',
            label: 'Contenido',
            list: true,
            templates: [
              {
                name: 'video',
                label: 'Video',
                fields: [
                  { type: 'string', name: 'title', label: 'Título', required: true },
                  { type: 'string', name: 'embed', label: 'URL embed', required: true },
                  { type: 'string', name: 'description', label: 'Descripción' },
                  { type: 'string', name: 'credits', label: 'Créditos' },
                  { type: 'number', name: 'year', label: 'Año' },
                  { type: 'boolean', name: 'showTitle', label: 'Mostrar título' },
                  ...displayFields,
                ],
              },
              {
                name: 'disco',
                label: 'Disco',
                fields: [
                  { type: 'string', name: 'title', label: 'Título', required: true },
                  { type: 'string', name: 'artist', label: 'Artista' },
                  { type: 'number', name: 'year', label: 'Año' },
                  { type: 'image', name: 'cover', label: 'Cover' },
                  {
                    type: 'object',
                    name: 'tracks',
                    label: 'Tracks',
                    list: true,
                    fields: [
                      { type: 'string', name: 'title', label: 'Título', required: true },
                      { type: 'string', name: 'file', label: 'Archivo MP3', required: true },
                    ],
                  },
                  { type: 'string', name: 'description', label: 'Descripción' },
                  { type: 'string', name: 'credits', label: 'Créditos' },
                  { type: 'boolean', name: 'showTitle', label: 'Mostrar título' },
                  ...displayFields,
                ],
              },
              {
                name: 'foto',
                label: 'Foto',
                fields: [
                  { type: 'string', name: 'title', label: 'Título', required: true },
                  { type: 'image', name: 'images', label: 'Imágenes', list: true },
                  { type: 'string', name: 'credits', label: 'Créditos' },
                  { type: 'boolean', name: 'showTitle', label: 'Mostrar título' },
                  ...displayFields,
                ],
              },
              {
                name: 'texto',
                label: 'Texto',
                fields: [
                  { type: 'string', name: 'title', label: 'Título', required: true },
                  { type: 'rich-text', name: 'content', label: 'Contenido' },
                  { type: 'number', name: 'year', label: 'Año' },
                  { type: 'string', name: 'credits', label: 'Créditos' },
                  { type: 'image', name: 'images', label: 'Imágenes', list: true },
                  { type: 'boolean', name: 'showTitle', label: 'Mostrar título' },
                  ...displayFields,
                ],
              },
              {
                name: 'bio',
                label: 'Bio',
                fields: [
                  { type: 'string', name: 'title', label: 'Título', required: true },
                  { type: 'rich-text', name: 'content', label: 'Contenido' },
                  { type: 'image', name: 'images', label: 'Imágenes', list: true },
                  { type: 'string', name: 'credits', label: 'Créditos' },
                  ...displayFields,
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});

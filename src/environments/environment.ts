// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// "url": "https://quiz-builder-api-test.azurewebsites.net/api/v1/"
export const environment = {
  production: false,
  cloudinaryConfiguration: {
    cloud_name: 'dbbkqtyqn',
    // theme: 'white',
    // show_powered_by: false,
    // max_files: 3,
    // multiple: false,
    cropping_aspect_ratio: null,
    // cropping_coordinates_mode: 'face',
    // cropping_show_back_button: true,
    // folder: 'user-photos',
    // tags: ['user', 'content'],
    resource_type: ['image', 'video'],
    // context: { alt: "my_alt", caption: "my_caption" },
    //  max_file_size: 3000000,
    max_image_width: '1000',
    max_image_height: '1000',
    // thumbnails: true,
    // button_class: 'quiz-class',
    // button_caption: 'uppp',
    min_image_height: '200',
    min_image_width: '200',
    // cropping_validate_dimensions: true,
    // cropping_show_dimensions: true,
    // google_api_key: 'AIzaSyAy4JAqdEiikwNCHYco3xDIX70QqvvXMCI',
    // sources: ['local', 'url', 'camera', 'dropbox', 'image_search', 'facebook', 'instagram'],
    upload_preset: 'pu3dk3lp',
    cropping: 'server'
  }
};

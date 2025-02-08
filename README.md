# CameraBounds for CesiumJS

`CameraBounds` is a JavaScript class designed to limit the movement of the camera in CesiumJS. It allows you to restrict camera movement based on distance from a specific entity or within a defined bounding box (BBOX). This module can be used in CesiumJS projects to control and constrain the camera's behavior.

## Features

- Restrict camera movement based on a specific distance and height from a given entity.
- Limit camera movement within a custom-defined bounding box (BBOX).
- Automatically revert the camera to a previous position if the movement exceeds the defined limits.
- Easy integration with CesiumJS's `Viewer` object.

- ## Demo Video

You can watch a demonstration of the `CameraBounds` functionality in action in the following video:

[Watch the demo video on Vimeo](https://vimeo.com/1033903810?share=copy#t=0)

## Live Demo

Try the live demo of the 3D map below:

[Visit the live demo](https://reunion3d.re/carte3D)

## Support the Project

If you find this project useful and would like to support its development, consider sponsoring me on GitHub. Your support helps ensure the project continues to grow and improve.

[Become a sponsor on GitHub](https://github.com/sponsors/romain974)

## Installation

To use `CameraBounds`, simply download the `CameraBounds.js` file and include it in your project.

1. Download the `CameraBounds.js` file from the repository.
2. Include it in your HTML file or JavaScript module:

```html
<script src="path/to/CameraBounds.js"></script>
```

3. After including the file, you can create an instance of `CameraBounds` as follows:

```javascript
const cameraBounds = new CameraBounds(cesiumViewer);
```

## Usage

### Creating an Instance

You need to initialize the `CameraBounds` class with an instance of `Cesium.Viewer`. This is the viewer where the camera movements will be controlled.

```javascript
const viewer = new Cesium.Viewer('cesiumContainer');
const cameraBounds = new CameraBounds(viewer);
```

### Limiting Camera Movement to a Bounding Box

You can restrict the camera movement to stay within a specified bounding box (BBOX) with the following parameters: `xmin`, `ymin`, `xmax`, `ymax`, and `zmax`.

```javascript
cameraBounds.limitBBOX(xmin, ymin, xmax, ymax, zmax);
```

### Limiting Camera Movement to a Specific Entity

You can also limit the camera's distance and height from a particular entity. This is useful when you want to ensure the camera doesn't move too far from an important object.

```javascript
const entity = viewer.entities.add({
    // Define your entity (e.g., a point or a model)
    position: Cesium.Cartesian3.fromDegrees(-75.10, 39.57),
    point: { pixelSize: 10, color: Cesium.Color.RED }
});

cameraBounds.limitEntity(entity, 500, 100); // distance = 500 meters, height = 100 meters
```

### Disabling Camera Movement Limitation

To stop restricting the camera movement, simply call the `disableCameraMovementLimitation` method.

```javascript
cameraBounds.disableCameraMovementLimitation();
```

## Example

Here is a basic example that limits the camera to a specific bounding box and entity distance:

```javascript
const viewer = new Cesium.Viewer('cesiumContainer');
const cameraBounds = new CameraBounds(viewer);

// Restrict camera within a bounding box
cameraBounds.limitBBOX(-80, 30, -70, 40, 10000);

// Add an entity and limit the camera to stay within 500 meters and 100 meters height from the entity
const entity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(-75.10, 39.57),
    point: { pixelSize: 10, color: Cesium.Color.RED }
});

cameraBounds.limitEntity(entity, 500, 100);
```

## Events

The `CameraBounds` class dispatches an event when the camera is blocked due to exceeding the movement limits:

- **`cameraBlocked`**: This event is fired when the camera exceeds the defined limits, and its position is reverted to the previous valid state.

Example:

```javascript
cameraBounds.addEventListener('cameraBlocked', function() {
    console.log('Camera movement is blocked!');
});
```

## Contributing

Contributions are welcome! If you'd like to improve the functionality or add new features, feel free to fork the repository, make changes, and submit a pull request.

Please ensure that your changes are well-documented and include relevant test cases if applicable.

### How to Contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/my-feature`).
3. Make your changes and commit (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/my-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Thanks to [CesiumJS](https://cesium.com/cesiumjs/) for providing the foundation for 3D geospatial visualization.
- This project is open-source and welcomes contributions from the community.


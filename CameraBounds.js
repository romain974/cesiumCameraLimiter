/**
 * Class to limit camera movement within a specified area in CesiumJS
 * This class provides functionality to restrict camera movement based on 
 * entity distance, bounding box (BBOX), or other conditions.
 */
export default class CameraBounds extends EventTarget {
    /**
     * Constructor for the CameraBounds class
     * @param {Cesium.Viewer} cesiumViewer - The CesiumJS Viewer instance
     */
    constructor(cesiumViewer) {
        super();
        this.viewer = cesiumViewer;
        this.init();
    }

    /**
     * Initializes the class by setting up initial values
     */
    init() {
        this.camera = this.viewer.camera;
        this.cameraMovementListener = undefined;
        this.previousCameraPosition = null;
        this.previousCameraOrientation = null;
    }

    /**
     * Tests whether the camera is beyond a specified distance and height from a given entity.
     * @param {Cesium.Entity} entity - The entity to test the distance from
     * @param {Number} distance - The maximum allowed horizontal distance from the entity
     * @param {Number} z - The maximum allowed height from the entity
     * @returns {Boolean} - Returns true if the camera position exceeds the distance or height, false otherwise
     */
    testCameraDistanceFromEntity(entity, distance, z) {
        let entityPosition;
        // Get position based on entity type (primitive or entity)
        if ("primitive" in entity) {
            entityPosition = entity.primitive.position;
        } else {
            entityPosition = entity.position.getValue();
        }
        
        const cameraPosition = this.camera.position;
        const ellipsoid = this.viewer.scene.globe.ellipsoid;

        // Project camera and entity positions onto the geodetic surface
        const cameraPositionOnEllipsoid = ellipsoid.scaleToGeodeticSurface(
            cameraPosition, 
            ellipsoid.cartesianToCartographic(cameraPosition)
        );
        const entityPositionOnEllipsoid = ellipsoid.scaleToGeodeticSurface(
            entityPosition, 
            ellipsoid.cartesianToCartographic(entityPosition)
        );

        // Calculate distance between camera and entity
        const distCamera = Cesium.Cartesian3.distance(cameraPositionOnEllipsoid, entityPositionOnEllipsoid);
        const positionCartographic = this.camera.positionCartographic;
        const cameraHeight = positionCartographic.height;

        // Check if distance or height exceeds the limits
        return distCamera > distance || cameraHeight > z;
    }

    /**
     * Tests whether the camera is within a specified bounding box (BBOX).
     * @param {Number} xmin - Minimum longitude of the bounding box
     * @param {Number} ymin - Minimum latitude of the bounding box
     * @param {Number} xmax - Maximum longitude of the bounding box
     * @param {Number} ymax - Maximum latitude of the bounding box
     * @param {Number} zmax - Maximum height of the bounding box
     * @returns {Boolean} - Returns true if the camera is outside the bounding box, false if inside
     */
    testCameraBBOX(xmin, ymin, xmax, ymax, zmax) {
        const cameraPosition = this.camera.positionCartographic;
        const { longitude, latitude } = cameraPosition;

        // Convert longitude and latitude to degrees
        const lon = Cesium.Math.toDegrees(longitude);
        const lat = Cesium.Math.toDegrees(latitude);
        const z = cameraPosition.height;

        // Check if the camera position is inside the bounding box
        return !(lon >= xmin && lon <= xmax && lat >= ymin && lat <= ymax && z <= zmax);
    }

    /**
     * Limits the camera's movement to stay within a specified bounding box (BBOX).
     * @param {Number} xmin - Minimum longitude of the bounding box
     * @param {Number} ymin - Minimum latitude of the bounding box
     * @param {Number} xmax - Maximum longitude of the bounding box
     * @param {Number} ymax - Maximum latitude of the bounding box
     * @param {Number} zmax - Maximum height of the bounding box
     */
    limitBBOX(xmin, ymin, xmax, ymax, zmax) {
        this.limitCamera(this.testCameraBBOX, [xmin, ymin, xmax, ymax, zmax]);
    }

    /**
     * Limits the camera's movement to a certain distance and height from a specified entity.
     * @param {Cesium.Entity} entity - The entity to limit the camera's distance from
     * @param {Number} distance - The maximum allowed distance from the entity
     * @param {Number} z - The maximum allowed height from the entity
     */
    limitEntity(entity, distance, z) {
        this.limitCamera(this.testCameraDistanceFromEntity, [entity, distance, z]);
    }

    /**
     * Limits the camera's movement based on a specified distance test or bounding box test.
     * @param {Function} distanceTestFunction - The function used to test distance or BBOX
     * @param {Array} parameters - The parameters for the distance test function
     */
    limitCamera(distanceTestFunction, parameters) {
        // Disable any previous camera movement limitations
        this.disableCameraMovementLimitation();

        // Function to check camera position and apply limits
        const checkCameraPosition = () => {
            // If the camera violates the distance test, revert to the previous position
            if (distanceTestFunction.apply(this, parameters)) {
                this.camera.setView({
                    destination: this.previousCameraPosition,
                    orientation: this.previousCameraOrientation,
                });
                this.dispatchEvent(new Event('cameraBlocked'));
            } else {
                // Update the previous camera position and orientation
                this.previousCameraPosition = Cesium.Cartesian3.clone(this.camera.position);
                this.previousCameraOrientation = {
                    heading: this.camera.heading,
                    pitch: this.camera.pitch,
                    roll: this.camera.roll,
                };
            }
        };

        // Add a preRender event listener to check camera position before each render
        this.cameraMovementListener = this.viewer.scene.preRender.addEventListener(checkCameraPosition);
    }

    /**
     * Disables any active camera movement limitations.
     */
    disableCameraMovementLimitation() {
        if (Cesium.defined(this.cameraMovementListener)) {
            this.cameraMovementListener();
            this.cameraMovementListener = undefined;
        }
    }
}

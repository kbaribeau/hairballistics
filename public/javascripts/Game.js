
var WIDTH = 1000;
var HEIGHT = 500;

var Renderer = function(world, ocanvas) {
    var drawImage = function(filename, x, y) {
        path = 'images/' + filename;
        //context.drawImage(image, x, y);
        var image = ocanvas.display.image({
            x: x,
            y: y,
            //origin: { x: "center", y: "center" }, //FIXME: LATER
            image: path
        });

        ocanvas.addChild(image, false);
    }

    var convertToCanvasCoords = function(pos) {
        return Point(pos.x, HEIGHT-pos.y);
    };

    var drawTargettingLine = function(kitten) {
        /*
        context.beginPath();
        var mouthPos = kitten.mouthPosition();

        //fudge positioning to look good
        mouthPos.x += 10
        mouthPos.y -= 15

        var endPos = Vector.add(mouthPos, world.currentPower());
        var screenMouthPos = convertToCanvasCoords(mouthPos);
        var screenEndPos = convertToCanvasCoords(endPos);

        context.moveTo(screenMouthPos.x, screenMouthPos.y);
        context.lineTo(screenEndPos.x, screenEndPos.y);

        context.stroke();
        */
    };

    var kittenProperties = {
        yellow: {
            headImage: "orange_head.png",
            bodyImage: "orange_body.png",
            headOffset: Point(25, 20),
        },
        gray: {
            headImage: "black_head.png",
            bodyImage: "black_body.png",
            headOffset: Point(0, 20),
        },
    };

    return {
        clearCanvas: function() {
            ocanvas.clear();
        },

        drawHairball: function(hairball) {
            var pos = convertToCanvasCoords(hairball.position);
            drawImage('hairball.png', pos.x, pos.y);
        },

        drawKitten: function(kitten) {
            var prop = kittenProperties[kitten.color];
            var bodyPos = convertToCanvasCoords(kitten.position);
            drawImage(prop.bodyImage, bodyPos.x, bodyPos.y);

            var headPos = convertToCanvasCoords(Vector.add(kitten.position, prop.headOffset));
            drawImage(prop.headImage, headPos.x, headPos.y);
        },
        drawTargettingLine: drawTargettingLine,

    };
};

var Kitten = function(x, y, color) {
    var targettingLine = null;
    var resetPower = function() {
        targettingLine = Point(1, 1);
    }
    resetPower();

    return {
        position: Point(x, y),
        color: color,
        mouthPosition: function() {
            return Point(x+50, y+25);
        },
        targettingLine: function() {
            return targettingLine;
        },
        incrementPower: function() {
           mag = Vector.magnitude(targettingLine);
           targettingLine = Vector.setMagnitude(targettingLine, ((mag + .2) % 50) + 1)
        },
        resetPower: resetPower,
    };
};

var Physics = {
    GRAVITY: 1, // in pixels per tick

    applyGravity: function(velocity) {
        return Vector.add(velocity, Point(0, Physics.GRAVITY * -1))
    }
};

$(document).ready(function() {
    var domCanvas = document.getElementById("game");
    if (domCanvas) {
        var ocanvas = oCanvas.create({
            canvas: '#game'
        });
        domCanvas.width = WIDTH;
        domCanvas.height = HEIGHT;
        var hairballistics = Hairballistics();
        var renderer = Renderer(hairballistics, ocanvas);

        $(document).on('keydown', hairballistics.keyDownHandler);
        $(document).on('keyup', hairballistics.keyUpHandler);

        var redraw = function() {
            hairballistics.tick();
            renderer.clearCanvas();
            ocanvas.redraw();
            hairballistics.withHairball(renderer.drawHairball);
            hairballistics.withKittens(renderer.drawKitten);
            renderer.drawTargettingLine(hairballistics.currentKitten())
        };

        setInterval(redraw, 24); // ~48 fps
    }
});

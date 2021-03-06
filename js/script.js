var height_ratio = 0.5;
var frame_interval = 25;

var show_fd_chart = true;
var show_static_magnets = true;

//initialize texture objects
function init() {
    $('#fd_chart_checkbox').change( function() {
        if (this.checked) {
            show_fd_chart = true;
        } else {
            show_fd_chart = false;
        }
    });

    $('#static_magnets_checkbox').on('change', function() {
        if (this.checked) {
            show_static_magnets = true;
        } else {
            show_static_magnets = false;
        }
    });

    for (i in texture_obj) {
        var w = $('#'+texture_obj[i].name+' .interaction_box').width();
        $('#'+texture_obj[i].name+' .interaction_box').attr('height', w*height_ratio+'px');
        $('#'+texture_obj[i].name+' .interaction_box canvas').attr('width', w+'px');
        $('#'+texture_obj[i].name+' .interaction_box canvas').attr('height', w*height_ratio+'px');
        texture_obj[i].canvas = document.getElementById(texture_obj[i].name+'_canvas');
        texture_obj[i].ctx = texture_obj[i].canvas.getContext('2d');
        texture_obj[i].init();
        texture_obj[i].img = new Image();
        texture_obj[i].img.onload = texture_obj[i].calcFD;
        texture_obj[i].img.src = texture_obj[i].src;
    }
}

//animation variables and animation function
var path_color = 'rgba(0, 0, 0, 1.0)';
var path_width = 3;
var moving_magnet_color = 'rgba(255, 255, 255, 0.6)';
var moving_magnet_color_active = 'rgba(240, 240, 240, 0.9)';
var moving_magnet_path_width = 1;
var magnet_arrow_size = 0.5;
var chart_color = 'rgba(150, 150, 150, 0.8)';
var static_magnet_fill = 'rgba(255, 255, 255, 0.25)';
var static_magnet_stroke = 'rgba(0, 0, 0, 0.5)';
function animate() {
    for (i in texture_obj) {
        if (texture_obj[i].initialized) {
            texture_obj[i].update();
            texture_obj[i].display(
                path_color, 
                path_width, 
                moving_magnet_color, 
                moving_magnet_color_active, 
                moving_magnet_path_width, 
                magnet_arrow_size, chart_color, 
                static_magnet_fill, 
                static_magnet_stroke, 
                show_fd_chart, 
                show_static_magnets
            );
        } else {
            texture_obj[i].calcFD();
        }
    }
}
setInterval(animate, frame_interval);

//mouse events
var texture_selected = false;
$(document).on('mousemove', function(e) {
    for (i in texture_obj) {
        if (texture_obj[i].initialized) {
            texture_obj[i].getCursor(e.pageX, e.pageY);
        }
    }
});
$(document).on('mousedown', function(e) {
    if (!texture_selected) {
        for (i in texture_obj) {
            if (texture_obj[i].hover) {
                texture_obj[i].selected = true;
                texture_selected = true;
            }
        }
    }
});
$(document).on('mouseup', function(e) {
    if (texture_selected) {
        for (i in texture_obj) {
            texture_obj[i].selected = false;
        }
        texture_selected = false;
    }
});
$(window).on('resize', function() {
    for (i in texture_obj) {
        var w = $('#'+texture_obj[i].name+' .interaction_box').width();
        $('#'+texture_obj[i].name+'_canvas').attr('width', w+'px');
        $('#'+texture_obj[i].name+'_canvas').attr('height', w*height_ratio+'px');
        texture_obj[i].getDimensions();
    }
});


//texture objects
var attract_center_img_src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAADICAYAAAAzx/4XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxEAAAsRAX9kX5EAAAspSURBVHhe7d39VVpLFMbhYypIKghUkFCBUEGgAqECSQVoBWoFYAWQCsAKSCrAVJB0cO99WecskQt6PmbmzMfvWSsrwH8x+rr3njkzF//8JwMC9Pz8nD08PGSbzSb7+fNn/umLr1+/Zv1+P7u8vMyGw2H+KVwiYBAcBctkMtkHS1mdTiebzWbZeDzOP4ELBAyCcn9/n33//j1/V52qmvl8vv8b9hEwCMLfv3/3Vctqtco/aUYhQzVjHwED7ylcBoPByTlLEwoYBQ3s+ZD/DXjJVrjIYrHYV0Wwh4CB10ajkZVwKRAydhEw8JaGuVVWiuoiZOxhBgMvtfFDz0zGPAIG3tE+l16vt5+/uHZzc7PfLwMzCBh4R0NdF63ROSxhm8MMBl7RRro2w0XUmtkcLKeECgbeUEvU7XZbaY2Offz4Mdvtdvu/UR8VDLyhVSMfwkWK/TdohoCBF9QWaeXIJ2qTWL5uhoCBF25vb/NXflHo+RZ8IWEGg9apevG5HdEcZr1e8wR2DQQMWtf2snQZOk9mu90y9K2IFgmtUrD4Hi5SHHKFaggYtMrX2cspOotG+3RQHi0SWuP77OUctUrMY8qhgkFrdGB3iHSEhC/7dXxHBYNWaKahXbuh0i0Fy+Uyf4dzqGDQilCrlwLzmHKoYOCcT88cNcH+mPdRwcA5/faPYYahf4OWrpnHnEfAwLnQ26NDel6pyT1NsSNg4JR+IGM7a4Xnlc4jYODU4+Nj/iouqmK0MobXGPLCqU+fPkU7s9CwV5vw8IIKBs7EMtw9h3nM/xEwcCbW9uiQ9saYuj87BrRIcEKVi9qjFHCe7wsqGDiR0m91hameVwIBA0d+/PiRv0qDnhQP6SgKW2iRYF1K7dExPUrQ7/fzd+mhgoF1KQ89Uz/agYCBdam1R4dSn8fQIsGqlNujQ3d3d9l0Os3fpYMKBlaFcKC3C9qAF9szWGUQMLAq5fboWIrzGFokWBXzs0d1pHbUJhUMrFF7RLi8phW1lI7aJGBgDe3RaSnNYwgYWMOA97xU5jEEDKzQ4UsprpqUlcpVtAQMrKB6eV8K8xgCBlYwfykn9nkMy9SwguXp8jqdzv6ozRjPj6GCgXH6jUy4lKd5TKzPKxEwMI75S3X6msV4fgwtEowbDAaETE2xnR9DwMC4i4uL/BWqiu08X1okGEXl0oxmV6oAY0HAwKinp6f8FerSkDyW+5UIGBhFBWNGLPcrMYOBUcxfzNEcRkNfXUkbKioYGEP1YpbmMXpeKeQ9RQQMjGH+Yp7mMSE/FEnAwBienrZDs5hQh77MYGAMzx/ZNZ/Ps/F4nL8LAxUMjOD5I/vUKi0Wi/xdGAgYGEF75IZCJqSvNQEDIxjwuqOdvqGEDAEDI6hg3CkeJwjha86QF43pG57rYd0LYSMeFQwao3ppR1HJ+LzBkYBBY8xf2lOEjK+rSwQMGqOCaZ+vS9jMYNAYG+z8oY142pDnCyoYNKIDqwkXf6iKUcvky/8JAYNGaI/8o6Fvr9fz4v+GgEEjv379yl/BJ6osfRj+EjBohDNg/KU2ScNf/WmrZWLIi0YY8IZBt0cul0vnm/KoYFAbA95w6P9KcxnXl7sRMKhN37QIy83NjdMBMAGD2tjBGyaFS1HN2K5ACRjUxhJ12Ipqxub1KAQMaiNgwqc2dzQa7Ze0bbS8rCKhNu5Ais90Os1ms5mxu7GpYFAL+1/ipBslu92usfkMAYNaaI/ipWDRfMZE0BAwqOX379/5K8TKRNAQMKiFCiYdh0GjC+CqDIMZ8qIWHhFIm86dubq6yvr9fv7JaQQMKlOwcMg3RM82XV9fZ8Ph8OTKEy0SKqM9QkHfC3paW+3TqUvhCBhURsDgmKpanT2jncHFUFizGgIGlbGChLcoWIqhMAGDyqhgUBZDXlTGChLKImBQGc8goSxaJADWEDAArCFgAFhDwACwhoABYA0BA8AaAgaANdrQwD4YlMKWKVRFBQPAGgIGgDUEDABrCBgA1hAwAKwhYABYQ8AAsIaAQSmm7ipGWggYlKLrKYCqCBiUQsCgjg+73W5/Anin08k/Av7v8+fP+SugvFdn8uq0+IeHh2y1WnGoM15Zr9fvXhMKHDt56LfCRSGjsOGKCsifP38Y9KKyd28V2Gw22ePj4/7WNqRJwaKAAap6d8irsng+n2ea1UynU36LJYgBL+oqvYqkIfDd3d0+aDQUJmjSQcCgrsrL1AqW2WxG0CSEFSTUVXsfDEGTDioY1GXs6litPN3e3mb39/f5J4iFoW8RJMjYTl5VMMWMhv0S8WADJpowFjAFfUNqU9ZyueSbMwK0R2jCeMAUhsNhtt1u9/MZhIuAQRPWAkaKQbCChm/UMF1eXuavgOqsBkxB4UI1EybaXDRhbBWpLD3bNBqNsufn5/wT+EoVKI8IoAknFcyhopoZj8f5J/AVbS2ach4wot+Mer5Jf9ig5y+2G6CpVgKmoCpGS9r0+X768uVL/gqop9WAkaJl4relf2iR0FTrASNqk1TJMJfxh/5PqCzRlBcBUyjmMmgfFSVM8CpgRFUMIdM+2iOY4F3ASDH8ZYWpPezghQnON9pVoU15g8GAGw5awCHfMMHLCqagMp1Kxj193fmawwSvA0YIGfeYv8AU7wNGipCBG8xfYEoQASMKGVaX3KCCgSleD3lP0QVwk8kkfwfT1IryBDVMCaaCKWgJWxfAwQ422MGk4AJGdLi4juSEebRHMCnIgBHNY/hhMI8BL0wKbgZziI145gX87QAPBVvBCCtLZjF/gWlBB4xoFsPQ1wwCBqYFHzCioS/zmOaYv8C0oGcwhzSH6Xa7zGMaYP4C06KoYEQbxHRdLeqhPYIN0QSM6IeEy93q+fbtW/4KMCeaFumQlq43m03+DmVwvS9siDJgNIfp9XrcHlkSzx/BlqhapALzmGqYv8CWKANGVO5r+RrvY/4CW6JskQ7pov3VapW/wym73Y47kGBF9AHDPOZtqvQ04AVsiLZFKjCPeRvzF9gUfcAI85jzmL/ApuhbpEPMY15jeRq2JVHBFHS0A8PMF5wKCNuSChjmMa/RHsG2pAJGmMe8YMAL25ILGNEBVan/cKk9UkUH2JRkwIhapZR/wGiP4EJSq0jH9MS1nrxOkVaPqGBgW7IVjKR6fgztEVxJOmBkNpslN4+hPYIrSbdIhdTO86U9givJVzCiH7ZU7leiPYJLBEwulfuVrq6u8leAfbRIR3S0g66kjZEqF549gktUMEdi3h8zHo/zV4AbBMwRPQwZ66MEtEdwjYA5Qb/pY/ttr2ew9AdwiYA5I7b7rq+vr/NXgDsMed+gYa8eJQh9f4xmSjrYm+VpuEYF8wZVMNrpGzq1e4QL2kAFU0LoR21yLQnaQgVTQshHbWoDIeGCthAwJai9CPWoTYa7aBMBU1KIR23qKXGOxUSbmMFUFNI8Zr1eEzBoFQFTUShX0SpYFDBAm2iRKirmMb4v+8awvI7wETA1+D6PYfYCXxAwNfn8vBLVC3zBDKYh386PUeilcjof/EfANOTTeb6aC/HMEXxCi9SQfph9Wa1Ra0S4wCcEjAEa+rbdlmiom8KZwggLAWOIZh9tXeKmqoW5C3xEwBikFqWNlSUtmfNAI3xEwBimSsJlyKgt8nW5HGAVyZLJZJItFov8nR08DgDfUcFYYruS0WA51CMkkA4CxiJbIaNwUeXCkjR8R8BYppAxucKjE+oIF4SCgHFAVcx2u91XHk1otSjmmycRHwLGEYWLQkbVTNUlZVUtegSAjXQIDatILdGpeE9PT9lmszn5sKQCSatEOlOXPS4IU5b9C4kuUitAXTXEAAAAAElFTkSuQmCC";
var repel_center_img_src = "data:image/png;base64,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";
var attract_step_img_src = "data:image/png;base64,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";
var repel_step_img_src = "data:image/png;base64,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";
//var attract_end_img_src = "data:image/png;base64,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";
var attract_end_img_src = "data:image/png;base64,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";
var repel_end_img_src = "data:image/png;base64,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";

var texture_obj = [
    new Texture(
        "attract_center", //name
        attract_center_img_src, //chart img src
        0.5, //start position of magnet 0-1
        0.25, //start position of path relative to width of canvas
        0.75, //end position of path relative to width of canvas
        14.0, //length of path in mm
        2.0, //max force magnitude in newtons
        0.25, //force multiplier of drag
        0.6, //dampening factor over velocity
        0.9, //mass of magnet
        3.175, //width of magnet
        3.175, //height of magnet
        [{'pos':0.5, 'attract':true}] //static magnet array
        ),

    new Texture(
        "repel_center", //name
        repel_center_img_src, //chart img src
        0.5, //start position of magnet 0-1
        0.25, //start position of path relative to width of canvas
        0.75, //end position of path relative to width of canvas
        14.0, //length of path in mm
        2.0, //max force magnitude in newtons
        0.25, //force multiplier of drag
        0.5, //dampening factor over velocity
        0.9, //mass of magnet
        3.175, //width of magnet
        3.175, //height of magnet
        [{'pos':0.01, 'attract':false}, {'pos':0.99, 'attract':false}] //static magnet array
        ),

    new Texture(
        "attract_step", //name
        attract_step_img_src, //chart img src
        0.01, //start position of magnet 0-1
        0.25, //start position of path relative to width of canvas
        0.75, //end position of path relative to width of canvas
        14.0, //length of path in mm
        2.0, //max force magnitude in newtons
        0.25, //force multiplier of drag
        0.5, //dampening factor over velocity
        0.9, //mass of magnet
        3.175, //width of magnet
        3.175, //height of magnet
        [{'pos':0.01, 'attract':true}, {'pos':0.99, 'attract':true}] //static magnet array
        ),

    new Texture(
        "repel_step", //name
        repel_step_img_src, //chart img src
        0.01, //start position of magnet 0-1
        0.25, //start position of path relative to width of canvas
        0.75, //end position of path relative to width of canvas
        14.0, //length of path in mm
        2.0, //max force magnitude in newtons
        0.25, //force multiplier of drag
        0.5, //dampening factor over velocity
        0.9, //mass of magnet
        3.175, //width of magnet
        3.175, //height of magnet
        [{'pos':0.5, 'attract':false}] //static magnet array
        ),
    
    new Texture(
        "attract_end", //name
        attract_end_img_src, //chart img src
        0.01, //start position of magnet 0-1
        0.25, //start position of path relative to width of canvas
        0.57, //0.75, //end position of path relative to width of canvas
        9.0, //14.0, //length of path in mm
        2.0, //max force magnitude in newtons
        0.25, //force multiplier of drag
        0.5, //dampening factor over velocity
        0.9, //mass of magnet
        3.175, //width of magnet
        3.175, //height of magnet
        [{'pos':0.01, 'attract':true}] //static magnet array
        ),

    new Texture(
        "repel_end", //name
        repel_end_img_src, //chart img src
        0.99, //start position of magnet 0-1
        0.25, //start position of path relative to width of canvas
        0.75, //end position of path relative to width of canvas
        14.0, //length of path in mm
        2.0, //max force magnitude in newtons
        0.25, //force multiplier of drag
        0.5, //dampening factor over velocity
        0.9, //mass of magnet
        3.175, //width of magnet
        3.175, //height of magnet
        [{'pos':0.01, 'attract':false}] //static magnet array
        )
];


//texture class
function Texture(name, src, startpos, pathstart, pathend, pathlength, maxforce, forcemult, dampening, mass, magnetwidth, magnetheight, staticmag) {
    this.initialized = false;
    
    this.name = name;
    this.src = src;
    this.img;
    this.canvas;
    this.ctx;
    this.xpos;
    this.ypos;
    this.w;
    this.h;

    this.path_start = pathstart;
    this.path_end = pathend;
    this.path_length = pathlength;

    this.fd = [];
    this.pixel_per_mm;
    this.pixel_per_newton;
    this.max_force = maxforce;
    this.magnet_width = magnetwidth;
    this.magnet_height = magnetheight;

    this.pos = startpos;
    this.vel = 0;
    this.acc = 0;
    this.mass = mass;
    this.force_multiplier = forcemult;
    this.dampening = dampening;

    this.selected = false;
    this.hover = false;
    this.cursor = {'x': 0, 'y': 0};

    this.static_mag = staticmag;
    
    this.init = function() {
        this.ctx.translate(0.5, 0.5);
        this.getDimensions();
    }

    //get canvas position and size, calibrate pixels to real world values
    this.getDimensions = function() {
        var o = $('#'+this.name+'_canvas').offset();
        this.xpos = o.left;
        this.ypos = o.top;
        this.w = $('#'+this.name+'_canvas').width();
        this.h = $('#'+this.name+'_canvas').height();
        this.pixel_per_mm = ((this.path_end - this.path_start)*this.w)/this.path_length;
        this.pixel_per_newton = (this.magnet_height * this.pixel_per_mm)/this.max_force;
    }

    //get mouse position relative to canvas
    this.getCursor = function(x, y) {
        this.cursor.x = x - this.xpos;
        this.cursor.y = y - this.ypos;

        var rendered_start = {'x': Math.round(this.w*this.path_start), 'y': Math.round(this.h/2)};
        var rendered_path_length = Math.round(this.w*(this.path_end - this.path_start));
        var rendered_pos = {'x': Math.round(this.pos*rendered_path_length + rendered_start.x), 'y': rendered_start.y};
        var rendered_magnet_width = Math.round(this.magnet_width*this.pixel_per_mm);
        var rendered_magnet_height = Math.round(this.magnet_height*this.pixel_per_mm);
        
        if (!this.selected) {
            if (this.cursor.x > rendered_pos.x - rendered_magnet_width/2 &&
                this.cursor.x < rendered_pos.x + rendered_magnet_width/2 &&
                this.cursor.y > rendered_pos.y - rendered_magnet_height &&
                this.cursor.y < rendered_pos.y ) 
            {
                    this.hover = true;
            } else {
                this.hover = false;
            }
        }
    }

    //calculate force displacement values by analyzing image
    this.calcFD = function() {
        if (this.img != undefined) {
            this.ctx.drawImage(this.img, 0, 0, this.w, this.h);
            var imgdata = this.ctx.getImageData(0, 0, this.w, this.h);
            for (var i=0; i<this.w; i++) {
                this.fd[i] = {'x': i/this.w*this.path_length, 'y': 0};
                for (var j=0; j<this.h/2; j++) {
                    var indexJ1 = j*this.w*4 + i*4;
                    var indexJ2 = (this.h-j-1)*this.w*4 + i*4;
                    if (imgdata.data[indexJ1] < 10 && imgdata.data[indexJ1+3] > 0) {
                        this.fd[i].y = (this.h/2 - j) / (this.h/2) * this.max_force;
                        break;
                    } else if (imgdata.data[indexJ2] < 10  && imgdata.data[indexJ2+3] > 0) {
                        this.fd[i].y = (-this.h/2 + j) / (this.h/2) * this.max_force;
                        break;
                    }
                }
            }
            this.clearCanvas();
            this.initialized = true;
        }
    }

    //calculate and update position 
    this.update = function() {
        var rendered_start = {'x': Math.round(this.w*this.path_start), 'y': Math.round(this.h/2)};
        var rendered_path_length = Math.round(this.w*(this.path_end - this.path_start));
        var rendered_pos = {'x': Math.round(this.pos*rendered_path_length + rendered_start.x), 'y': rendered_start.y};

        var curr_force = this.returnForce(this.pos*this.path_length);
        var applied_force = 0;
        if (this.selected) {
            applied_force = (this.cursor.x - rendered_pos.x)/this.pixel_per_mm * this.force_multiplier;
        }
        var resultant_force = applied_force - curr_force;
        this.acc = resultant_force / this.mass;
        this.vel = this.vel + this.acc - this.vel*this.dampening;
        this.pos = this.pos + this.vel / this.path_length;
        this.pos = this.pos >= 0.99 ? 0.99 : this.pos < 0.01 ? 0.01 : this.pos;
        this.vel = this.pos >= 0.99 ? 0 : this.pos < 0.01 ? 0 : this.vel;
    }

    //draw function
    this.display = function(pcol, pwidth, mmcol, mmcol_active, mmwidth, mmarrow, ccol, smfill, smstroke, show_chart, show_static) {
        
        this.clearCanvas();
        
        var rendered_start = {'x': Math.round(this.w*this.path_start), 'y': Math.round(this.h/2)};
        var rendered_path_length = Math.round(this.w*(this.path_end - this.path_start));
        var rendered_pos = {'x': Math.round(this.pos*rendered_path_length + rendered_start.x), 'y': rendered_start.y};
        var rendered_magnet_width = Math.round(this.magnet_width*this.pixel_per_mm);
        var rendered_magnet_height = Math.round(this.magnet_height*this.pixel_per_mm);

        if (show_chart) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = ccol;
            this.ctx.lineWidth = 1;
            for (var i=0; i<rendered_path_length; i=i+3) {
                var fdpos = i/this.pixel_per_mm;
                var force_at_location = this.returnForce(fdpos);
                this.ctx.moveTo(rendered_start.x + i, rendered_start.y);
                this.ctx.lineTo(rendered_start.x + i, rendered_start.y - force_at_location*this.pixel_per_newton);
            }
            this.ctx.stroke();
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = mmcol;
        if (this.selected || this.hover) {
            this.ctx.fillStyle = mmcol_active;
        }
        this.ctx.strokeStyle = pcol;
        this.ctx.lineWidth = mmwidth;
        this.ctx.rect(rendered_pos.x - rendered_magnet_width/2, rendered_pos.y - rendered_magnet_height, rendered_magnet_width, rendered_magnet_height);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.fillStyle = pcol;
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(rendered_pos.x, rendered_pos.y - rendered_magnet_height*(0.5+mmarrow/2));
        this.ctx.lineTo(rendered_pos.x - rendered_magnet_height*mmarrow*0.125, rendered_pos.y - rendered_magnet_height/2);
        this.ctx.lineTo(rendered_pos.x + rendered_magnet_height*mmarrow*0.125, rendered_pos.y - rendered_magnet_height/2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(rendered_pos.x + rendered_magnet_height*mmarrow*0.125, rendered_pos.y - rendered_magnet_height/2);
        this.ctx.lineTo(rendered_pos.x, rendered_pos.y - rendered_magnet_height*(0.5-mmarrow/2));
        this.ctx.lineTo(rendered_pos.x - rendered_magnet_height*mmarrow*0.125, rendered_pos.y - rendered_magnet_height/2);
        this.ctx.stroke();

        if (show_static) {
            for (i in this.static_mag) {
                var rendered_sm_pos = {'x': Math.round(this.static_mag[i].pos*rendered_path_length + rendered_start.x), 'y': rendered_start.y};
                this.ctx.beginPath();
                this.ctx.strokeStyle = smstroke;
                this.ctx.lineWidth = mmwidth;
                this.ctx.fillStyle = smfill;
                this.ctx.setLineDash([3]);
                this.ctx.rect(rendered_sm_pos.x - rendered_magnet_width/2, rendered_pos.y, rendered_magnet_width, rendered_magnet_height);
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.setLineDash([]);

                this.ctx.beginPath();
                this.ctx.lineWidth = 1;
                this.ctx.fillStyle = smstroke;
                this.ctx.moveTo(rendered_sm_pos.x, rendered_sm_pos.y + rendered_magnet_height*(0.5+mmarrow/2));
                this.ctx.lineTo(rendered_sm_pos.x - rendered_magnet_height*mmarrow*0.125, rendered_sm_pos.y + rendered_magnet_height/2);
                this.ctx.lineTo(rendered_sm_pos.x + rendered_magnet_height*mmarrow*0.125, rendered_sm_pos.y + rendered_magnet_height/2);
                this.ctx.lineTo(rendered_sm_pos.x, rendered_sm_pos.y + rendered_magnet_height*(0.5+mmarrow/2));
                if (!this.static_mag[i].attract) {
                    this.ctx.fill();
                }
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(rendered_sm_pos.x + rendered_magnet_height*mmarrow*0.125, rendered_sm_pos.y + rendered_magnet_height/2);
                this.ctx.lineTo(rendered_sm_pos.x, rendered_sm_pos.y + rendered_magnet_height*(0.5-mmarrow/2));
                this.ctx.lineTo(rendered_sm_pos.x - rendered_magnet_height*mmarrow*0.125, rendered_sm_pos.y + rendered_magnet_height/2);
                if (this.static_mag[i].attract) {
                    this.ctx.fill();
                }
                this.ctx.stroke();
            }
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = pcol;
        this.ctx.rect(rendered_start.x - rendered_magnet_width/2, rendered_start.y-pwidth/2, rendered_path_length + rendered_magnet_width, pwidth);
        this.ctx.fill();

        if (this.selected) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = pcol;
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(rendered_pos.x, rendered_pos.y - rendered_magnet_height/2);
            this.ctx.lineTo(this.cursor.x, this.cursor.y);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.fillStyle = pcol;
            this.ctx.ellipse(this.cursor.x, this.cursor.y, 3, 3, 0, 0, 2*Math.PI, false);
            this.ctx.fill();
        }
    }

    this.clearCanvas = function() {
        this.ctx.clearRect(-this.w, -this.h, this.w*3, this.h*3);
    }

    //return force value at particular displacement
    this.returnForce = function(x) {
        var force_val = 0;
        for (var i=0; i<this.fd.length; i++) {
            if (i < this.fd.length-1) {
                if (x >= this.fd[i].x && x < this.fd[i+1].x) {
                    var delta = x - this.fd[i].x;
                    force_val = delta*(this.fd[i+1].y - this.fd[i].y) + this.fd[i].y;
                    break;
                }
            } else {
                if (x >= this.fd[i].x) {
                    force_val = this.fd[i].y;
                    break;
                }
            }
        }
        return force_val;
    }
}
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Function for creating and initializing the diagram
function Sikdiagram(){
  window.sikdiagram = this; //Make object easily accessible though the console during development
  console.log("Diagram info is available as: window.sikdiagram");

  this.r = 50;
  this.circlelength = 2 * Math.PI * this.r;
  this.strokewidth = 0.6;
  this.isAnimating = false;
  this.animationLength = 1000;4
}

// Initialises everything. Data must be added first.
Sikdiagram.prototype.init = function( id ){
  this.id = id;
  this.wrapper = document.getElementById( id );
  this.wrapper.className = 'sikdiagram-wrapper';
  this.wrapper.style.height = this.wrapper.offsetWidth+"px";
  this.buildSvg();
  this.buildRings();
  this.buildInnerSections();
  this.buildUI();    

};

// Adds the data to the object
Sikdiagram.prototype.addData = function(data){
  this.data = data;
};

// Builds the SVG element with all children and set global vars
Sikdiagram.prototype.buildSvg = function(){
  // Add Svg element
  // var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  var svg = this.wrapper.getElementsByTagName('svg');
  svg = svg[0];
  svg.className = "sikdiagram";

  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("x", 0);
  svg.setAttribute("y", 0);
  svg.setAttribute("xml:space", "preserve");
  svg.style.maxWidth = "100%";
  this.svg = svg;
  this.wrapper.appendChild( svg );

  // Add Coloured sections as <circle>
  var offset = 0; // Position/rotation Offset
  for ( var section in this.data ) {
    // New circle element
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    // Calculate the size of the border dash. Circumference of the part
    var dashsize = this.circlelength / 100 * this.data[section].size;

    circle.setAttribute("id", section);
    circle.className = "section";

    circle.setAttribute("r", this.r);
    circle.setAttribute("cx", this.r);
    circle.setAttribute("cy", this.r);
    circle.setAttribute("fill", "transparent");
    circle.setAttribute("stroke", this.data[section].color);
    circle.setAttribute("stroke-width", this.r*1.5);

    circle.setAttribute("data-size", this.data[section].size);
    circle.setAttribute("data-color", this.data[section].color);
    circle.setAttribute("data-strokeDashoffset", offset);
    circle.setAttribute("data-strokeDashsize", dashsize);

    circle.style.strokeDashoffset = offset;
    circle.style.strokeDasharray = dashsize+" "+this.circlelength;
    offset -= dashsize;

    this.svg.appendChild( circle );
  }

};

Sikdiagram.prototype.buildUI = function(){
  var resetbutton = document.createElement("button");
  resetbutton.setAttribute("id", this.id+"_reset");
  resetbutton.classList.add("reset");
  var that = this;
  resetbutton.addEventListener("click", function(){that.resetBackgrounds();} );

  this.wrapper.appendChild( resetbutton );

  var infobox = document.createElement("div");
  infobox.classList.add('infobox');
  this.infobox = infobox;
  this.wrapper.appendChild( infobox );
  this.infobox.appendChild( document.createElement("h3") );
  this.infobox.appendChild( document.createElement("div") );

  this.buildLists();
};

Sikdiagram.prototype.buildLists = function(){
  var listWrapper = document.createElement("div");
  listWrapper.classList.add("list-wrapper");
  this.listWrapper = listWrapper;
  this.wrapper.appendChild(listWrapper);

  var that = this;

  var list = document.createElement("ul");
  list.classList.add("main-list");
  this.listWrapper.appendChild(list);

  for ( var list0 in this.data ) {
    var li0 = document.createElement("li");
    var li0label = document.createElement("p");
    li0label.classList.add("li-label");
    li0label.textContent = this.data[list0].name;
    if( this.data[list0].color ){
      li0label.style.backgroundColor = this.data[list0].color;
      li0label.style.border = "1px solid "+this.data[list0].color;
    }
    if( this.data[list0].textColor ){
      li0label.style.color = this.data[list0].textColor;
    }
    li0label.addEventListener("click", function(){ this.classList.toggle("active"); console.log(this); } );
    li0.appendChild( li0label );
    list.appendChild( li0 );

    if( this.data[list0].html ){
      li0.classList.add('has-info');
      var content = document.createElement("div");
      content.innerHTML = this.data[list0].html;
      if( this.data[list0].color ){
        content.style.borderColor = this.data[list0].color;
      }
      li0.appendChild( content );
    }

    if( this.data[list0].children ){
      li0.classList.add('has-children');
      var ul0 = document.createElement("ul");
      li0.appendChild( ul0 );

      for ( var list1 in this.data[list0].children ) {
        var li1 = document.createElement("li");
        var li1label = document.createElement("p");
        li1label.classList.add("li-label");
        li1label.textContent = this.data[list0].children[list1].name;
        li1label.addEventListener("click", function(){ this.classList.toggle("active"); console.log(this); } );
        if( this.data[list0].color ){
          li1label.style.border = "1px solid "+this.data[list0].color;
        }
        li1.appendChild( li1label );
        ul0.appendChild( li1 );

        if( this.data[list0].children[list1].html ){
          li1.classList.add('has-info');
          var content = document.createElement("div");
          content.innerHTML = this.data[list0].children[list1].html;
          if( this.data[list0].color ){
            content.style.borderColor = this.data[list0].color;
          }
          li1.appendChild( content );
        }

        if( this.data[list0].children[list1].children ){
          li1.classList.add('has-children');
          var ul1 = document.createElement("ul");
          li1.appendChild( ul1 );

          for ( var list2 in this.data[list0].children[list1].children ) {
            var li2 = document.createElement("li");
            var li2label = document.createElement("p");
            li2label.classList.add("li-label");
            li2label.textContent = this.data[list0].children[list1].children[list2].name;
            li2label.addEventListener("click", function(){ this.classList.toggle("active"); console.log(this); } );
            if( this.data[list0].color ){
              li2label.style.border = "1px solid "+this.data[list0].color;
            }
            li2.appendChild( li2label );
            ul1.appendChild( li2 );

            if( this.data[list0].children[list1].children[list2].html ){
              li2.classList.add('has-info');
              var content = document.createElement("div");
              content.innerHTML = this.data[list0].children[list1].children[list2].html;
              if( this.data[list0].color ){
                content.style.borderColor = this.data[list0].color;
              }
              li2.appendChild( content );
            }

          }
        }

      }
    }
  }

};

Sikdiagram.prototype.buildRings = function(){
  for (var i = 1; i <= 3; i++) {
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", this.r / 4 * i);
    circle.setAttribute("cx", this.r);
    circle.setAttribute("cy", this.r);
    circle.setAttribute("fill", "transparent");
    circle.setAttribute("stroke", "#FFF");
    circle.setAttribute("stroke-width", this.strokewidth);
    circle.setAttribute("id", "outerring_"+i);
    circle.setAttribute("stroke-opacity", "1");
    circle.style.opacity = 1;

    this.svg.appendChild( circle );
  }
};

Sikdiagram.prototype.buildInnerSections = function(){

  var angle0 = 0;
  for ( var section in this.data ) {
    var col0Obj = this.data[section];
    col0Obj.line = this.drawOuterLine( section );
    col0Obj.parentSection = section;


    var angle1 = 0;
    if(typeof this.data[section].children !== "undefined"){
      for( var col1ID in this.data[section].children ) {
        var col1Obj = this.data[section].children[col1ID];
        col1Obj.parentSection = section;

        var angle2 = 0;
        if(typeof col1Obj.children !== "undefined" ){
          for( var col2ID in col1Obj.children ) {
            var col2Obj = col1Obj.children[col2ID];
            col2Obj.parentSection = section;

            var col2width = ( ( col2Obj.size * 3.6 ) / 100 * col1Obj.size ) / 100 * col0Obj.size;
            angle2 += col2width;
            this.drawInnerLine(angle2 + angle1 + angle0, this.r/4);
            this.displayLabel((angle2 + angle1 + angle0) - (col2width/2), this.r, col2Obj);
            // console.log("Third Ring \""+col2Obj.name+"\" ends at "+angle2+" degrees.");
          }
        }
        var col1width = ( col1Obj.size * 3.6 ) / 100 * col0Obj.size;
        angle1 += col1width;
        this.drawInnerLine(angle1 + angle0, this.r/4*2);
        this.displayLabel((angle1 + angle0) - (col1width/2), this.r/4*3, col1Obj);

        // console.log("Second Ring \""+col1Obj.name+"\" ends at "+angle1+" degrees.");
      }
    }
    var col0width = col0Obj.size * 3.6;
    angle0 += col0width;
    this.displayLabel(angle0 - col0width/2, this.r/4*2, col0Obj);
    // console.log("First Ring \""+col0Obj.name+"\" ends at "+angle0+" degrees.");
  } // For Col0
};

Sikdiagram.prototype.displayLabel = function( angle, length, data){
  var labelWrapper = document.createElement("div");
  labelWrapper.classList.add("label-wrapper");
  this.wrapper.appendChild( labelWrapper );
  labelWrapper.style.width = (length*2)+"%";
  labelWrapper.style.transform = "translateY(-50%) rotate("+(angle+180)+"deg)";

  var label = document.createElement("p");
  label.classList.add("label");
  label.classList.add("hideonactive");
  label.textContent = data.name;
  var width = 0;
  if( length == this.r ){
    width = 12.5;
  }else if( length == this.r / 2 ){
    width= 25;
  }else{
    width = 16.6;
  }
  label.style.width = width+"%";
  label.setAttribute("title", data.name);
  label.setAttribute("data-section", data.parentSection);

  if( this.data[data.parentSection].inverted ){
    label.classList.add("inverted");
  }
  if( this.data[data.parentSection].textColor ){
    labelWrapper.style.color = this.data[data.parentSection].textColor;
  }

  labelWrapper.appendChild( label );

  if(data.html){
    var that = this;
    var sectionID = label.getAttribute("data-section");
    label.addEventListener("click", function(){that.displayInfo(data); that.setBackground(sectionID);} );
    label.classList.add("hasinfo");
  }
};

Sikdiagram.prototype.drawOuterLine = function( parentId ){
  var line = document.createElementNS("http://www.w3.org/2000/svg", "rect");

  var parent = this.svg.getElementById( parentId );
  rotation = parent.getAttribute("data-strokeDashoffset") / this.circlelength * 360;

  line.setAttribute( "x", 0 );
  line.setAttribute( "y", this.r );
  line.setAttribute( "width", this.r*2 );
  line.setAttribute( "height", 2 );

  line.setAttribute("fill","transparent");
  line.setAttribute("stroke","#FFFFFF");
  line.setAttribute("stroke-width",this.strokewidth);
  line.setAttribute("transform","rotate("+-rotation+" "+this.r+" "+this.r+")");
  line.style.webkitTransform = "rotate("+-rotation+"deg)";
  line.style.transform = "rotate("+-rotation+"deg)";
  line.style.strokeDasharray = 0+" "+this.r+" "+this.r +" "+(this.r*2)+4;


  line.setAttribute("id", "outerseperator_"+parentId);

  this.svg.appendChild( line );
  return line;
};

Sikdiagram.prototype.drawInnerLine = function( angle, length, classname ){
  var radians = Math.radians( angle );
  var offset = this.r - length;
  var x1 = Math.cos(radians) * offset,
      y1 = Math.sin(radians) * offset,
      x2 = Math.cos(radians) * (length + offset),
      y2 = Math.sin(radians) * (length + offset);

  var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute( "x1", x1 + this.r );
  line.setAttribute( "y1", y1 + this.r );
  line.setAttribute( "x2", x2 + this.r );
  line.setAttribute( "y2", y2 + this.r );

  line.setAttribute("stroke","#FFFFFF");
  line.setAttribute("stroke-width",this.strokewidth);
  line.setAttribute("stroke-opacity",1);
  line.style.opacity = 1;
  this.svg.appendChild( line );
};



Sikdiagram.prototype.displayInfo = function( data ){
  if(this.data[data.parentSection].textColor){
    this.infobox.style.color = this.data[data.parentSection].textColor;
  }else{
    this.infobox.style.color = "";
  }
  this.infobox.getElementsByTagName("h3")[0].textContent = data.name;
  if(data.html){
    this.infobox.getElementsByTagName("div")[0].innerHTML = data.html;
  }else{
    this.infobox.getElementsByTagName("div")[0].innerHTML = "";
  }
};

// Function to activate a section/background.
Sikdiagram.prototype.setBackground = function( id ){
  this.wrapper.classList.add("active");

  var maincircle = this.svg.getElementById( id );
  maincircle.style.strokeDasharray = this.circlelength/2+" "+this.circlelength;
  maincircle.style.strokeDashoffset = 0;
  this.data[id].line.setAttribute("transform","rotate(0 "+this.r+" "+this.r+")");
  this.data[id].line.style.transform = "rotate(0deg)";

  var offset = 0;
  for ( var section in this.data ) {
    if( section !== id ){

      var circle = this.svg.getElementById( section );

      var dashsize = ( this.data[section].size / ( 100-maincircle.getAttribute('data-size') ) * this.circlelength ) / 2;
      circle.style.strokeDasharray = dashsize+" "+this.circlelength;
      circle.style.strokeDashoffset = ( (this.circlelength / 2)* -1 ) + offset;
      var linerotation = offset / this.circlelength * 360;
      linerotation -= 180;
      this.data[section].line.style.webkitTransform  = "rotate("+-linerotation+"deg)";
      this.data[section].line.setAttribute("transform","rotate("+-linerotation+" "+this.r+" "+this.r+")");
      this.data[section].line.style.transform = "rotate("+-linerotation+"deg)";

      offset -= dashsize;
    }
  }

};

// Resets the sections
Sikdiagram.prototype.resetBackgrounds = function(){
  this.wrapper.classList.remove("active");
  for ( var section in this.data ) {
    this.resetBackground( section );
  }
};
Sikdiagram.prototype.resetBackground = function( id ){
  var circle = this.svg.getElementById( id );
  circle.style.strokeDashoffset = circle.getAttribute("data-strokeDashoffset");
  circle.style.strokeDasharray = circle.getAttribute("data-strokeDashsize")+" "+this.circlelength;
  var linerotation = circle.getAttribute("data-strokeDashoffset") / this.circlelength * 360;
  this.data[id].line.style.webkitTransform = "rotate("+-linerotation+"deg)";
  this.data[id].line.setAttribute("transform","rotate("+-linerotation+" "+this.r+" "+this.r+")");
  this.data[id].line.style.transform = "rotate("+-linerotation+"deg)";

};

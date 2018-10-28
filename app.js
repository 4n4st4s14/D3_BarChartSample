var data            =   [
    { key: 0, num: 6 },
    { key: 1, num: 20 },
    { key: 2, num: 21 },
    { key: 3, num: 14 },
    { key: 4, num: 2 },
    { key: 5, num: 30 },
    { key: 6, num: 7 },
    { key: 7, num: 16 },
    { key: 8, num: 25 },
    { key: 9, num: 5 },
    { key: 10, num: 11 },
    { key: 11, num: 28 },
    { key: 12, num: 10 },
    { key: 13, num: 26 },
    { key: 14, num: 9 }
];
var key             =   function(d){
    return d.key;
};

// Create SVG Element
var chart_width     =   800;
var chart_height    =   400;
var bar_padding     =   5;
var sort_flag       =   false;
var svg             =   d3.select( '#chart' )
    .append( 'svg' )
    .attr( 'width', chart_width )
    .attr( 'height', chart_height );

// Create Scales
// 800 / 15 = 53.33
// 0, 53.33, 106.66
var x_scale         =   d3.scaleBand()
    .domain( d3.range( data.length ) )
    .rangeRound([ 0, chart_width ])
    .paddingInner( 0.05 );
var y_scale         =   d3.scaleLinear()
    .domain([
        0, d3.max( data, function(d){
            return d.num;
        })
    ])
    .range([ 0, chart_height ]);

// Bind Data and create bars
svg.selectAll( 'rect' )
    .data( data, key )
    .enter()
    .append( 'rect' )
    .attr( 'x', function( d, i ){
        return x_scale(i);
    })
    .attr( 'y', function(d ){
        return chart_height - y_scale( d.num );
    })
    .attr( 'width', x_scale.bandwidth() )
    .attr( 'height', function( d ){
        return y_scale( d.num );
    })
    .attr( 'fill', '#7ED26D' )
    .on( 'click', function(){
        svg.selectAll( 'rect' )
            .sort(function(a, b){
                return sort_flag ? d3.descending(a.num,b.num) : d3.ascending(a.num, b.num);
            })
            .transition( 'sort' )
            .duration( 1000 )
            .attr( 'x', function( d, i ){
                return x_scale(i);
            });

        svg.selectAll( 'text' )
            .sort(function(a, b){
                return sort_flag ? d3.descending(a.num,b.num) : d3.ascending(a.num, b.num);
            })
            .transition()
            .duration( 1000 )
            .attr( 'x', function( d, i ){
                return x_scale( i ) + x_scale.bandwidth() / 2;
            });

        sort_flag       =   !sort_flag;
    })
    .on( 'mouseover', function( d ){
        var x       =   parseFloat(d3.select(this).attr('x'))  +
                        x_scale.bandwidth()*9;
        var y       =   parseFloat(d3.select(this).attr('y')) /
                        2 + chart_height / 2;

        d3.select('#tooltip')
            .style( 'left', x + "px" )
            .style( 'top', y + "px" )
            .style( 'display', 'block' )
            .text("data is "+d.num);
    })
    .on( 'mouseout', function(){
        d3.select( '#tooltip' )
            .style( 'display', 'none' )
    });
// Create Labels
svg.selectAll( 'text' )
    .data(data, key)
    .enter()
    .append( 'text' )
    .text(function( d ){
        return d.num;
    })
    .attr( 'x', function( d, i ){
        return x_scale( i ) + x_scale.bandwidth() / 2;
    })
    .attr( 'y', function(d ){
        return chart_height - y_scale(d.num) + 15;
    })
    .attr( 'font-size', 14 )
    .attr( 'fill', '#fff' )
    .attr( 'text-anchor', 'middle' );

// Events
d3.select('.update').on("click", function() {
    console.log(1);
    // Reverse Data
    // data.reverse();
    data[0].num         =   50;
    y_scale.domain([ 0, d3.max(data, function(d){
        return d.num;
    })]);

    //Update Bars
    svg.selectAll("rect")
        .data(data, key)
        .transition()
        .delay(function(d, i){
            return i / data.length * 1000;
        })
        .duration(1000)
        .ease(d3.easeElasticOut)
        .attr("y", function(d) {
            return chart_height - y_scale(d.num);
        })
        .attr("height", function(d) {
            return y_scale(d.num);
        });

    // Update Labels
    svg.selectAll("text")
        .data(data, key)
        .transition()
        .delay(function(d, i){
            return i / data.length * 1000;
        })
        .duration(1000)
        .ease(d3.easeElasticOut)
        .text(function( d ){
            return d.num;
        })
        .attr("x", function(d, i) {
            return x_scale(i) + x_scale.bandwidth() / 2;
        })
        .attr("y", function(d) {
            return chart_height - y_scale(d.num) + 15;
        })
});

// Add Data
d3.select('.add').on( 'click', function(){
    // Add New Data
    var new_num         =   Math.floor(Math.random() * d3.max(data, function(d){
        return d.num;
    }));
    data.push({
        key: data[data.length-1].key+1, num: new_num
    });

    // Update Scales
    x_scale.domain(d3.range(data.length));
    y_scale.domain([ 0, d3.max(data, function(d){
        return d.num;
    })]);

    // Select Bars
    var bars            =   svg.selectAll( 'rect' ).data(data, key);

    // Add New Bar
    bars.enter()
        .append( "rect" )
        .attr( 'x', function(d, i) {
            return x_scale(i);
        })
        .attr( 'y', chart_height )
        .attr( 'width', x_scale.bandwidth() )
        .attr( 'height', 0)
        .attr( 'fill', '#7ED26D' )
        .merge(bars)
        .transition()
        .duration(1000)
        .attr("x", function(d, i) {
            return x_scale(i);
        })
        .attr("y", function(d) {
            return chart_height - y_scale(d.num);
        })
        .attr("width", x_scale.bandwidth())
        .attr("height", function(d) {
            return y_scale(d.num);
        });

    // Add New Labels
    var labels      =   svg.selectAll( 'text' ).data(data, key);
    labels.enter()
        .append( "text" )
        .text(function( d ){
            return d.num;
        })
        .attr( 'x', function(d, i) {
            return x_scale(i) + x_scale.bandwidth() / 2;
        })
        .attr( 'y', chart_height )
        .attr("font-size", "14px")
        .attr("fill", "#fff")
        .attr("text-anchor", "middle")
        .merge(labels)
        .transition()
        .duration(1000)
        .attr("x", function(d, i) {
            return x_scale(i) + x_scale.bandwidth() / 2;
        })
        .attr("y", function(d) {
            return chart_height - y_scale(d.num) + 15;
        })
});

// Remove Data
d3.select('.remove').on('click', function(){
    // Remove first item
    data.shift();

    // Update Scales
    x_scale.domain(d3.range(data.length));
    y_scale.domain([ 0, d3.max(data, function(d){
        return d.num;
    })]);

    // Select Bars
    var bars            =   d3.selectAll('rect').data(data, key);

    // Update Bars
    bars.transition()
        .duration(500)
        .attr("x", function(d, i) {
            return x_scale(i);
        })
        .attr("y", function(d) {
            return chart_height - y_scale(d.num);
        })
        .attr("width", x_scale.bandwidth())
        .attr("height", function(d) {
            return y_scale(d.num);
        });

    // Remove bar
    bars.exit()
        .transition()
        .attr( 'x', -x_scale.bandwidth() )
        .remove();

    // Select Labels
    var labels          =   d3.selectAll('text').data(data, key);

    // Update Labels
    labels.transition()
        .duration(500)
        .attr("text-anchor", "start")
        .attr("x", function(d, i) {
            return x_scale(i) + x_scale.bandwidth() / 2;
        })
        .attr("y", function(d) {
            return chart_height - y_scale(d.num) + 15;
        });

    labels.exit()
        .transition()
        .attr( 'x', -x_scale.bandwidth() )
        .remove();
});

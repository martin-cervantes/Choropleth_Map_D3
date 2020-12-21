import topojson from "topojson-client";

const getEducationData = async () => {
  try {
    const response = await fetch(`https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json`, { mode: 'cors' });

    const data = await response.json();

    return data;
  } catch (error) {
    alert(error);
  }
  return false;
};

const getCountiesData = async () => {
  try {
    const response = await fetch(`https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json`, { mode: 'cors' });

    const data = await response.json();

    return data;
  } catch (error) {
    alert(error);
  }
  return false;
};


const drawMap = async (education, counties) => {
  const educationData = await education;
  const countiesData = await counties;


  const colors = [
    "#42A5F5",
    "#2196F3",
    "#1E88E5",
    "#1976D2",
    "#1565C0",
    "#0D47A1"
  ];

  const width = window.innerWidth - 20;
  const height = window.innerHeight - 130;
  const padding = 70;

  const path = d3.geoPath();


  const getEducationValue = (countyId) => {
    var returnValue = null;

    educationData.forEach(value => {
      if (value.fips == countyId) {
        returnValue = value;
      }
    });

    return returnValue;
  };

  const minEducation = d3.min(educationData, d => (d.bachelorsOrHigher));

  const maxEducation = d3.max(educationData, d => (d.bachelorsOrHigher));

  const colorRangeFactor = (maxEducation - minEducation) / colors.length;

  const svg = d3.select("#main")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  let tooltip = d3.select("body")
    .append("div")
    .attr("class", "toolTip")
    .attr("id", "tooltip");

  svg.append("g")
    .selectAll("path")
    .data(topojson.feature(countiesData, countiesData.objects.counties).features)
    .enter()
    .append("path")
    .attr("fill", (d, i) => {
      let colorIndex = 0;
      const eduObj = getEducationValue(d.id);
      colorIndex = parseInt((eduObj.bachelorsOrHigher - minEducation) / colorRangeFactor);
      return colors[colorIndex];
    })
    .attr("d", path)
    .attr("class", "county")
    .attr("data-fips", d => {
      const eduObj = getEducationValue(d.id);

      return eduObj.fips;
    }).attr("data-education", d => {
      const eduObj = getEducationValue(d.id);

      return eduObj.bachelorsOrHigher;
    })
    .on("mouseover", (d, i) => {
      let education = "";

      const eduObj = getEducationValue(d.id);
      education = eduObj.bachelorsOrHigher;

      tooltip
      .attr("data-education", education)
      .attr("id", "tooltip")
      .style("left", d3.event.pageX + 20 + "px")
      .style("top", d3.event.pageY + "px")
      .style("display", "inline-block")
      .style("opacity", 1)
      .html("Education: " + education);
    })
    .on("mouseout", function(d) {
      tooltip.style("opacity", 0);
    });

  const legendsvg = d3.select("#main")
    .append("svg")
    .attr("class", "svglegend")
    .attr("width", w)
    .attr("height", 60)
    .attr("x", padding)
    .attr("y", h)
    .attr("id", "legend")
    .style("fill", "black");

  const xScaleLegend = d3.scaleLinear()
    .domain([0, 6])
    .range([10, w / 3.95 - padding]);

  const xAxisLegend = d3.axisBottom(xScaleLegend)
    .tickFormat((d, i) => {
      const scaleLabel = minEducation + colorRangeFactor * i;

      return scaleLabel.toFixed(1);
    })
    .ticks(7);

  legendsvg.append("g")
    .attr("transform", "translate(0," + 40 + ")")
    .attr("id", "x-axislegend")
    .call(xAxisLegend);

  legendsvg.selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("x", (d, i) => (xScaleLegend(i)))
    .attr("y", d => (10))
    .attr("width", 50)
    .attr("height", 30)
    .style("fill", (d, i) => (colors[i]));
}

drawMap(getEducationData(), getCountiesData());

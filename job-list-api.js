// Replace "leverdemo" with your own company name
url = 'https://api.lever.co/v0/postings/aira?mode=json'


//Checking for potential Lever source or origin parameters
var pageUrl = window.location.href;
var leverParameter = '';
var trackingPrefix = '?lever-'

if (pageUrl.indexOf(trackingPrefix) >= 0)
{
  // Found Lever parameter
  var pageUrlSplit = pageUrl.split(trackingPrefix);
  leverParameter = '?lever-' + pageUrlSplit[1];
}

//Functions for checking if the variable is unspecified
function cleanString(string)
{
  if (string)
  {
    var cleanString = string.replace(/\s+/ig, "");
    return cleanString;
  }
  else
  {
    return "Uncategorized";
  }
}

function nullCheck(string)
{
  if (!string)
  {
    var result = 'Uncategorized'
    return result;
  }
  else
  {
    return string;
  }
}

function createJobs(_data)
{
  for (i = 0; i < _data.length; i++)
  {

    var team = nullCheck(_data[i].title)
    var teamCleanString = cleanString(team);
    $('#jobs-roles').append(
      '<a href="#" class="btn wow fadeInUp ' + teamCleanString + '" style="visibility: hidden;" data-wow-delay=".15s" data-wow-duration="1s" data-wow-offset="300">' + team + '</a>'
    );
  }

  for (i = 0; i < _data.length; i++)
  {
    for (j = 0; j < _data[i].postings.length; j++)
    {
      var posting = _data[i].postings[j]
      var title = posting.text
      var description = posting.description
      //Making each job description shorter than 250 characters
      var shortDescription = $.trim(description).substring(0, 250)
        .replace('\n', ' ') + "...";
      var location = nullCheck(posting.categories.location);
      var locationCleanString = cleanString(location);
      var commitment = nullCheck(posting.categories.commitment);
      var commitmentCleanString = cleanString(commitment);
      var team = nullCheck(posting.categories.team);
      var teamCleanString = cleanString(team);
      var link = posting.hostedUrl + leverParameter;

      $('#jobs-list').append(
        '<div class="job wow fadeInUp ' + teamCleanString + ' ' + locationCleanString + ' ' + commitmentCleanString + '" style="visibility: hidden;" data-wow-delay=".15s" data-wow-duration="1s" data-wow-offset="300">' +
        '<a class="job-title" href="' + link + '"">' + title + '</a>' +
        '<p class="tags"><span>' + team + '</span><span>' + location + '</span><span>' + commitment + '</span></p>' +
        '<p class="description">' + shortDescription + '</p>' +
        '<a class="btn" href="' + link + '">Learn more</a>' +
        '</div>'

      );
    }
  }
}

//Creating filter buttons for sorting your jobs
function activateButtons(_data)
{
  $('#jobs-roles').on("click", "a", function (e)
  {
    e.preventDefault();
    for (i = 0; i < _data.length; i++)
    {
      var teamRaw = _data[i].title;
      var team = cleanString(teamRaw);
      var jobs = $("#jobs-list"); if ($(this).hasClass(team))
      {
        if ($(this).hasClass("active"))
        {
          $(this).removeClass("active");
          jobs.find(".job").fadeIn("fast");
        }
        else
        {
          $("#jobs-roles").find("a").removeClass("active");
          $(this).addClass("active");
          jobs.find("." + team).fadeIn("fast");
          jobs.find(".job").not("." + team).fadeOut("fast");
        }
      }
    }
  })
}

//Fetching job postings from Lever's postings API
$.ajax({
  dataType: "json",
  url: url,
  success: function (data)
  {
    createJobs(data);
    activateButtons(data);
  }
});
Sample Kaltura Player
=======================

This sample video player can be used to play Kaltura hosted videos while displaying complementary resources (i.e. presentations & handouts). The video player offers a video library interface to organize multiple videos into respective subsections which allows users to navigate to related videos with ease.

The Kaltura player is initialized in the /Module/KalturaPlayer/js/control.js file. Further customizations & player features can be enabled here, for more information on additional features you can reference their [documentation](http://player.kaltura.com/docs/kwidget)

Specifying a Video Library
--------------------------

The player is rendered on a blank html page, code from the index.html can be used to embed the custom player into an application. The Module/Data directory holds the specifications for the video library.

1.  Module/Data/Module/module\_data.xml dictates the overall library and references the videos that are available in the top left menu. The video player library can hold multiple sessions that are built from various parts. This file consists of a list of sessions which have 'parts' which reference specific videos. The title displayed in the top menu is specified here in the `name` field of each part.

### List of Sessions

    <sessions>
        <session name="Session 1" path="Session1">
            <part name="Sample Videos 1" path="part01" title="Sample Videos 1"/>
            <part name="Sample Videos 2" path="part02" title="Sample Videos 2"/>
        </session>
    </sessions>

Each session in the list will have a name and a path to the associated folder. Within each session there will be the video parts that you wish to show specified by their name, path, and desired title.

1.  Module/Data/Module/Session1/part.xml specifies what is displayed while a video is playing. The first video tag represents the main video that will be played. Videos are specified by the `id` field. (The video ID will need to be associated with the partnerID (wid) specified in the KalturaPlayer/js/control.js file when the HTML player is initialized.) Within the main video tag you are able to specify relatedvideos, presentation slides, cuepoints and resources that are available.

### Main Video Example

    <video id="0_crv76sa2" title="Ka'upu Fledgling" thumbnail="#" content="#">
    </video>

The Main video tag is defined by the specific video ID as well as a desired title. The thumbnail & content will be taken from the video itself unless otherwise specified.

### Related Videos Example

    <relatedvideos>
        <relate id="0_crv76sa2" title="Ka'upu Fledgling" thumbnail="#" content="#"/>
        <relate id="0_yw1cd72x" title="Papahanaumokuakea Marine National Monument" thumbnail="#" content="#"/>
        <relate id="0_mpoq358l" title="Halemaumau Lava Lake" thumbnail="#" content="#"/>
    </relatedvideos>

Related videos are defined just like the main video, with a video ID and title.

### Presentation Slides Example

    <cuepoints>
        <cuepoint id="VID01" time="00:00:00" src="media/Slides/noslide.png"/>
    </cuepoints>

Cuepoints are used to control presentation slides during the video. You can have multiple cuepoints and each have a unique ID and the time in the video that you wish to see the slide at. Each cuepoint will appear on the video progress bar as a marker and in the "Resources" tab on the right side of the player. Clicking on a slide in the "Resources" tab will take you to that time in the video.

### Resources Example

    <resources>
      <resource id="1" name="Handout: Sample PDF" src="media/Handouts/samplePDF.pdf"/>
    </resources>`

Resourses are defined by a unique ID, name, and a path to the desired file. All resources will be available in the "Resources" tab on the right of the video player

The last section to the part.xml files contains the related videos references. The videos in this section are generally of the same group (i.e. if there are 3 parts to a section then the remaining parts will be placed here). These video tags will also allow you to specify presentation slides, cuepoints and resources that are available.

Acknowledgements
================

This work was supported by the National Science Foundation under Grant No. (1118745) as part of the Developing Teaching Expertise (DTE) project based at the University of Michigan School of Education. This customized player was designed to support the work of teacher educators, enabling them to work with numerous multimedia assets and make on-the-fly decisions about which things to show and share during face-to-face and online real-time professional development sessions. We conducted several rounds of user experience studies and made adjustments based on this research. Still, there is much that can be improved. We hope this code will be used and improved over time. More information about the DTE project (including the education modules for which this player developed) can be found at: <http://math.crdg.hawaii.edu/dev-team/>

We gratefully acknowledge our user experience researchers: Nicholas Lobaito and Kristine Auwers; as well as our web developers, Chieu Vu Minh, \[INSERT NAME(S) OF VIETNAM TEAM\], Srikanth Lavu, and RevaComm.

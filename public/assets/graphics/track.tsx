<?xml version="1.0" encoding="UTF-8"?>
<tileset name="track" tilewidth="64" tileheight="64" tilecount="8" columns="4">
 <image source="track.png" width="256" height="128"/>
 <tile id="0">
  <objectgroup draworder="index">
   <object id="1" type="terrain" x="0.25" y="0.375">
    <properties>
     <property name="grass" type="bool" value="true"/>
     <property name="tarmac" type="bool" value="false"/>
    </properties>
    <polygon points="0,0 63.625,-0.125 63.625,15.125 -0.25,15.375"/>
   </object>
   <object id="2" type="terrain" x="0.25" y="49">
    <properties>
     <property name="grass" type="bool" value="true"/>
    </properties>
    <polygon points="0,0 63.75,0.25 63.75,15.125 -0.25,15"/>
   </object>
   <object id="3" type="terrain" x="0.25" y="16.125">
    <properties>
     <property name="tarmac" type="bool" value="true"/>
    </properties>
    <polygon points="0,0 63.625,-0.125 63.625,32.75 -0.125,32.875"/>
   </object>
   <object id="4" name="fence" type="fence" x="0" y="64" width="64" height="0.25"/>
   <object id="6" name="fence" type="fence" x="0" y="0" width="64" height="0.25"/>
  </objectgroup>
 </tile>
 <tile id="1">
  <objectgroup draworder="index">
   <object id="1" name="fence" type="fence" x="0" y="0" width="0.25" height="64"/>
   <object id="3" name="fence" type="fence" x="64" y="0" width="0.25" height="64"/>
  </objectgroup>
 </tile>
 <tile id="2">
  <objectgroup draworder="index">
   <object id="1" name="fence" type="fence" x="0" y="0" width="64" height="0.25"/>
   <object id="2" name="fence" type="fence" x="64" y="0" width="0.25" height="64"/>
  </objectgroup>
 </tile>
 <tile id="3">
  <objectgroup draworder="index">
   <object id="1" name="fence" type="fence" x="64" y="0" width="0.25" height="64"/>
   <object id="2" name="fence" type="fence" x="0" y="64" width="64" height="0.25"/>
  </objectgroup>
 </tile>
 <tile id="4">
  <objectgroup draworder="index">
   <object id="1" name="fence" type="fence" x="0" y="0" width="0.25" height="64"/>
   <object id="2" name="fence" type="fence" x="0" y="64" width="64" height="0.25"/>
  </objectgroup>
 </tile>
 <tile id="5">
  <objectgroup draworder="index">
   <object id="1" type="terrain" x="48.25" y="64">
    <properties>
     <property name="grass" type="bool" value="true"/>
    </properties>
    <polygon points="0,0 -0.125,-6 1.125,-10.75 3,-13.625 5.25,-14.875 10.125,-16 15.5,-16.125 15.625,-0.25"/>
   </object>
   <object id="2" type="terrain" x="16.25" y="63.875">
    <properties>
     <property name="grass" type="bool" value="true"/>
    </properties>
    <polygon points="0,0 -0.125,-27.5 0.625,-32.875 6.5,-41.125 14.75,-46.875 19.75,-47.875 48,-48 48,-63.75 -16.375,-63.875 -16.25,0.125"/>
   </object>
   <object id="3" type="terrain" x="16.375" y="63.875">
    <properties>
     <property name="tarmac" type="bool" value="true"/>
    </properties>
    <polygon points="0,0 32,0.375 31.75,-5.75 33.5,-10.625 34.75,-13.625 36.75,-14.75 41.75,-16 47.375,-16 48,-48.125 19.5,-47.625 14.75,-46.875 6,-40.875 0.625,-32.625 -0.375,-27.625"/>
   </object>
   <object id="4" name="fence" type="fence" x="0" y="0" width="0.25" height="64"/>
   <object id="5" name="fence" type="fence" x="0" y="0" width="64" height="0.25"/>
  </objectgroup>
 </tile>
</tileset>

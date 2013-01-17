<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
?>
<!doctype html>
<html lang="en">
<head>

  <meta charset="utf-8">
  <title>Content Tabs Tests</title>
  <link rel="stylesheet" href="css/style.css" media="screen" />
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
  <script src="../contentTabs.js"></script>
  <script>

    $(document).on('ready', function() {

      // init plugin
      $('.contentTabs').eq(0).contentTabs({
        tabLocation: 'left'
      });
      $('.contentTabs').eq(1).contentTabs({
        tabLocation: 'right'
      });
      $('.contentTabs').eq(2).contentTabs({
        tabLocation: 'top'
      });
      $('.contentTabs').eq(3).contentTabs({
        tabLocation: 'bottom'
      });
      $('.contentTabs').eq(4).contentTabs({
        displayTabs: false
      });

    });

  </script>

</head>
<body>
<div id="micrositeContainer">
<div id="micrositeContainerInner">
<div id="micrositeContainerCompress">

  <div id="micrositeHeader">Header</div>

  <div id="micrositeContent">

    <div id="micrositeContentColumnFull">

      <h2>Left tabs</h2>

      <?php include('inc/tabs.html'); ?>

      <h2>Right tabs</h2>

      <?php include('inc/tabs.html'); ?>

      <h2>Top tabs</h2>

      <?php include('inc/tabs.html'); ?>

      <h2>Bottom tabs</h2>

      <?php include('inc/tabs.html'); ?>

      <h2>No tabs</h2>

      <?php include('inc/tabs.html'); ?>

    </div>

    <div id="micrositeContentColumnLeft">

      Left Column

    </div>

    <div id="micrositeContentColumnRight">

      Right Column

    </div>

  </div>

  <div id="micrositeFooter">Footer</div>

</div>
</div>
</div>
</body>
</html>

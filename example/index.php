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
      $('.contentTabs').contentTabs();

      // create contact button and add to dom with click handler
      var contactBtn = $('<a>', {
        text: 'Contact HP',
        'class': 'button',
        href: 'http://www8.hp.com/us/en/contact-hp/contact.html'
      })
        .appendTo('.contentTabsNav')
        .on('click', function(e) {
          e.preventDefault();
          window.open(this.href);
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

      <?php include('inc/tabs.html'); ?>

    </div>

    <div id="micrositeContentColumnLeft">

      <?php include('inc/tabs.html'); ?>

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

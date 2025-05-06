window.addEventListener('load', function () {
  setTimeout(() => {
    const notifyMe = document.querySelector('.klaviyo-bis-trigger');
    if (!notifyMe) {
      return;
    }
    notifyMe.addEventListener('click', function () {
      setTimeout(() => {
        const iframe = document.querySelector('#klaviyo-bis-iframe');

        if (!iframe) {
          return;
        }

        if (iframe.contentDocument?.readyState === 'complete') {
          attachFormListener(iframe);
        } else {
          iframe.addEventListener('load', function () {
            attachFormListener(iframe);
          });
        }
      }, 1000); // delay to allow modal to load
    });
  }, 1000); // delay to ensure notifyMe is ready
});

function attachFormListener(iframe) {
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const form = iframeDoc.querySelector('form');

    if (!form) {
      return;
    }

    form.addEventListener('submit', async function () {
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput?.value;
      const companyId = 'KLAVIYO_PUBLIC_API'; // Replace with your Klaviyo company ID

      if (email) {
        try {
          klaviyo.identify({ "email": email });
          console.log('identify call happened')
        } catch (err) {
          console.log(`identify error ${err}`);
        }

        try {
          const response = await fetch(`https://a.klaviyo.com/client/profiles?company_id=${companyId}`, {
            method: 'POST',
            headers: {
              accept: 'application/vnd.api+json',
              revision: '2025-01-15',
              'content-type': 'application/vnd.api+json'
            },
            body: JSON.stringify({
              data: {
                type: "profile",
                attributes: {
                  email: email,
                  locale: '{{ request.locale.iso_code }}-{{localization.country.iso_code }}'
                }
              }
            })
          });
        } catch (error) {
          console.log(`Klaviyo API error ${error}`);
        }
      }
    });
  } catch (error) {
    console.log(`Error wtih form listener: ${error}`);
  }
}

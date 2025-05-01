
window.addEventListener('load', function () {
    console.log('page loaded');
    setTimeout(() => {
      const notifyMe = document.querySelector('.klaviyo-bis-trigger');
      if (!notifyMe) {
        console.warn('Notify Me button not found');
        return;
      }
    
      console.log('Notify Me button found');
    
      notifyMe.addEventListener('click', function () {
        console.log('Notify Me button clicked');
    
        setTimeout(() => {
          const iframe = document.querySelector('#klaviyo-bis-iframe');
          console.log(iframe);
    
          if (!iframe) {
            console.warn('Iframe not found');
            return;
          }
    
          if (iframe.contentDocument?.readyState === 'complete') {
            console.log('iframe loaded');
            attachFormListener(iframe);
          } else {
            iframe.addEventListener('load', function () {
              attachFormListener(iframe);
            });
          }
        }, 1000); // delay to allow modal to load
      });
            }, 1000); //  delay to ensure notifyMe is ready
          });
          
          function attachFormListener(iframe) {
            try {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          
              const form = iframeDoc.querySelector('form');
          
              if (!form) {
                console.log('Form not found inside iframe');
                return;
              }
          
              console.log('Form found inside iframe');
          
              form.addEventListener('submit', async function () {
                const emailInput = form.querySelector('input[type="email"]');
                const email = emailInput?.value;
                const companyId = 'KLAVIYO_ACCOUNT_ID'; // Replace with your Klaviyo company ID
          
                if (email) {
                  console.log(`Captured email: ${email}`);
                  try {
                  klaviyo.identify({"email": email})
                  }
                  catch(err){
                    console.log(`identify error ${err}`)
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
          
                    if (response.ok) {
                      console.log('Klaviyo profile updated');
                    } else {
                      const errorText = await response.text();
                      console.log('Klaviyo update failed:', errorText);
                    }
                  } catch (err) {
                    console.log('Failed to send data to Klaviyo')
                    }}})}
                    catch(err) {
                        console.log(err)
                    }}
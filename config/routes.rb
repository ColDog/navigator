Rails.application.routes.draw do
  root to: 'apps#index'
  resources :apps do
    get 'logs'
  end
end
